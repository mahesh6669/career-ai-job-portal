from PyPDF2 import PdfReader

SKILLS_DB = [
    "Python",
    "Java",
    "C",
    "C++",
    "JavaScript",
    "HTML",
    "CSS",
    "PHP",
    "MySQL",
    "PostgreSQL",
    "React",
    "NodeJS",
    "Machine Learning",
    "Data Analytics"
]

def extract_text_from_pdf(pdf_path):

    text = ""

    reader = PdfReader(pdf_path)

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    return text

def extract_skills(text):

    found_skills = []

    for skill in SKILLS_DB:
        if skill.lower() in text.lower():
            found_skills.append(skill)

    return found_skills