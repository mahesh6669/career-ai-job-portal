from fastapi import (
    FastAPI,
    HTTPException,
    Depends,
    UploadFile,
    File
)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
from database import engine, SessionLocal
from sqlalchemy.orm import Session


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from models import (
    Base,
    User,
    Resume,
    Job,
    Application
)

from schemas import (
    UserCreate,
    JobCreate,
    ApplyJob
)

from oauth2 import get_current_user

from auth import (
    hash_password,
    verify_password,
    create_access_token
)

from resume_parser import (
    extract_text_from_pdf,
    extract_skills
)

import os
import shutil
from fastapi.security import OAuth2PasswordRequestForm
print("Application columns:")
print(Application.__table__.columns.keys())

UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


# ======================
# STARTUP
# ======================
@app.on_event("startup")
def startup():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created!")


# ======================
# HOME API
# ======================
@app.get("/")
def home():
    return {
        "message": "CareerAI Backend Running Successfully"
    }


# ======================
# REGISTER API
# ======================
@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user.id
    }


# ======================
# LOGIN API
# ======================
@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):


    db_user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Email"
        )

    if not verify_password(
        form_data.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid Password"
        )

    access_token = create_access_token(
        data={"sub": db_user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# ======================
# PROFILE API
# ======================
@app.get("/me")
def get_profile(current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):

    user = db.query(User).filter(
        User.email == current_user
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "user_id": user.id,
        "name": user.name,
        "email": user.email
    }


# ======================
# RESUME ANALYZER API
# ======================
@app.post("/analyze-resume")
def analyze_resume(
    file: UploadFile = File(...),
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    user = db.query(User).filter(
        User.email == current_user
    ).first()

    new_resume = Resume(
        user_id=user.id,
        filename=file.filename,
        filepath=file_path
    )

    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)

    text = extract_text_from_pdf(file_path)
    skills = extract_skills(text)

    return {
        "resume_id": new_resume.id,
        "filename": file.filename,
        "skills": skills,
        "skills_count": len(skills)
    }


# ======================
# RESUME HISTORY API
# ======================
@app.get("/resumes")
def get_resumes(db: Session = Depends(get_db)):


    resumes = db.query(
        Resume
    ).all()

    return resumes


# ======================
# RESUME SCORE API
# ======================
@app.post("/resume-score")
def resume_score(
    file: UploadFile = File(...)
):

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    text = extract_text_from_pdf(
        file_path
    )

    skills = extract_skills(
        text
    )

    important_skills = [
        "Python",
        "Java",
        "MySQL",
        "PostgreSQL",
        "React",
        "NodeJS",
        "Machine Learning",
        "Data Analytics"
    ]

    found_skills = []

    for skill in important_skills:
        if skill in skills:
            found_skills.append(skill)

    score = int(
        (len(found_skills) /
         len(important_skills)) * 100
    )

    missing_skills = []

    for skill in important_skills:
        if skill not in skills:
            missing_skills.append(skill)

    return {
        "resume_score": score,
        "skills_found": found_skills,
        "missing_skills": missing_skills
    }


# ======================
# ADD JOB API
# ======================
@app.post("/add-job")
def add_job(
    job: JobCreate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == current_user
    ).first()

    new_job = Job(
        user_id=user.id,
        title=job.title,
        company=job.company,
        skills=job.skills,
        location=job.location
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return {
        "message": "Job added successfully",
        "job_id": new_job.id
    }


# ======================
# GET ALL JOBS
# ======================
@app.get("/jobs")
def get_jobs(db: Session = Depends(get_db)):


    jobs = db.query(Job).all()

    result = []

    for job in jobs:
        result.append({
            "id": job.id,
            "user_id": job.user_id,
            "title": job.title,
            "company": job.company,
            "skills": job.skills,
            "location": job.location
        })

    return result


# ======================
# GET JOB BY ID
# ======================
@app.get("/job/{job_id}")
def get_job(job_id: int, db: Session = Depends(get_db)):


    job = db.query(Job).filter(
        Job.id == job_id
    ).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return job


# ======================
# DELETE JOB
# ======================
@app.delete("/job/{job_id}")
def delete_job(
    job_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):


    user = db.query(User).filter(
        User.email == current_user
    ).first()

    job = db.query(Job).filter(
        Job.id == job_id
    ).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    if job.user_id != user.id:
        raise HTTPException(
            status_code=403,
            detail="You can delete only your own jobs"
        )

    db.delete(job)
    db.commit()

    return {
        "message": "Job deleted successfully"
    }

# ======================
# APPLY JOB API
# ======================
@app.post("/apply-job")
def apply_job(
    data: ApplyJob,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):


    user = db.query(User).filter(
        User.email == current_user
    ).first()

    job = db.query(Job).filter(
        Job.id == data.job_id
    ).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    application = Application(
        user_id=user.id,
        job_id=job.id,
        status="Applied"
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return {
        "message": "Application submitted successfully"
    }


# ======================
# MY APPLICATIONS API
# ======================
@app.get("/my-applications")
def my_applications(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):


    user = db.query(User).filter(
        User.email == current_user
    ).first()

    applications = db.query(
        Application
    ).filter(
        Application.user_id == user.id
    ).all()

    return applications

@app.get("/job-recommendations")
def job_recommendations(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):


    user = db.query(User).filter(
        User.email == current_user
    ).first()

    jobs = db.query(Job).all()

    resume = db.query(Resume).filter(
        Resume.user_id == user.id
    ).order_by(
        Resume.id.desc()
    ).first()

    if not resume:
        return []

    text = extract_text_from_pdf(
        resume.filepath
    )

    user_skills = extract_skills(text)

    recommendations = []

    for job in jobs:

        job_skills = [
            skill.strip()
            for skill in job.skills.split(",")
        ]

        matched = 0

        for skill in job_skills:
            if skill in user_skills:
                matched += 1

        score = int(
            (matched / len(job_skills)) * 100
        )

        recommendations.append({
            "job_id": job.id,
            "title": job.title,
            "company": job.company,
            "match_score": score
        })

    recommendations.sort(
        key=lambda x: x["match_score"],
        reverse=True
    )

    return recommendations
@app.get("/job-applicants/{job_id}")
def get_job_applicants(
    job_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # Get logged-in recruiter
    user = db.query(User).filter(
        User.email == current_user
    ).first()

    # Get job
    job = db.query(Job).filter(
        Job.id == job_id
    ).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    # Only job owner can view applicants
    if job.user_id != user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized"
        )

    applications = db.query(
        Application
    ).filter(
        Application.job_id == job_id
    ).all()

    applicants = []

    for app in applications:

        applicant = db.query(User).filter(
            User.id == app.user_id
        ).first()

        # Get applicant resume
        resume = db.query(Resume).filter(
            Resume.user_id == app.user_id
        ).order_by(
            Resume.id.desc()
        ).first()

        match_score = 0
        matched_skills = []
        missing_skills = []

        if resume:

            text = extract_text_from_pdf(
                resume.filepath
            )

            resume_skills = set(
                skill.strip().lower()
                for skill in extract_skills(text)
            )

            job_skills = set(
                skill.strip().lower()
                for skill in job.skills.split(",")
                if skill.strip()
            )

            matched_skills = sorted(
                list(job_skills.intersection(resume_skills))
            )

            missing_skills = sorted(
                list(job_skills - resume_skills)
            )

            if len(job_skills) > 0:
                match_score = int(
                    (len(matched_skills) / len(job_skills))
                    * 100
                )

        applicants.append({
            "application_id": app.id,
            "candidate_name": applicant.name,
            "candidate_email": applicant.email,
            "status": app.status,
            "match_score": match_score,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills
        })

    # Rank applicants by match score
    applicants = sorted(
        applicants,
        key=lambda x: x["match_score"],
        reverse=True
    )

    return applicants
@app.get("/my-posted-jobs")
def my_posted_jobs(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == current_user
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    jobs = db.query(Job).filter(
        Job.user_id == user.id
    ).all()

    return jobs

    

@app.get("/download-resume/{application_id}")
def download_resume(
    application_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    application = db.query(Application).filter(
        Application.id == application_id
    ).first()

    print("APPLICATION =", application)

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    print("RESUME ID =", application.resume_id)

    resume = db.query(Resume).filter(
        Resume.id == application.resume_id
    ).first()

    print("RESUME =", resume)

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    print("FILEPATH =", resume.filepath)

    return FileResponse(
        path=resume.filepath,
        filename=resume.filename,
        media_type="application/pdf"
    )

@app.get("/applicant-match-score/{application_id}")
def applicant_match_score(
    application_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # Get application
    application = db.query(Application).filter(
        Application.id == application_id
    ).first()

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    # Get applicant
    applicant = db.query(User).filter(
        User.id == application.user_id
    ).first()

    # Get latest resume
    resume = db.query(Resume).filter(
        Resume.user_id == application.user_id
    ).order_by(
        Resume.id.desc()
    ).first()

    if not resume:
        return {
            "candidate": applicant.name,
            "match_score": 0,
            "matched_skills": [],
            "missing_skills": [],
            "summary": "Resume not uploaded"
        }

    # Get job
    job = db.query(Job).filter(
        Job.id == application.job_id
    ).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    # Extract resume text
    text = extract_text_from_pdf(
        resume.filepath
    )

    # Resume skills
    resume_skills = set(
        skill.strip().lower()
        for skill in extract_skills(text)
    )

    # Job skills
    job_skills = set(
        skill.strip().lower()
        for skill in job.skills.split(",")
        if skill.strip()
    )

    # Matched skills
    matched_skills = job_skills.intersection(
        resume_skills
    )

    # Missing skills
    missing_skills = job_skills - resume_skills

    # Match score
    score = int(
        (len(matched_skills) / len(job_skills)) * 100
    ) if len(job_skills) > 0 else 0

    # Simple resume summary
    summary = text[:500].strip()

    return {
        "candidate": applicant.name,
        "match_score": score,
        "matched_skills": sorted(list(matched_skills)),
        "missing_skills": sorted(list(missing_skills)),
        "summary": summary
    }
        
