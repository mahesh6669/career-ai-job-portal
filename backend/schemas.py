from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class JobCreate(BaseModel):
    title: str
    company: str
    skills: str
    location: str


class ApplyJob(BaseModel):
    job_id: int