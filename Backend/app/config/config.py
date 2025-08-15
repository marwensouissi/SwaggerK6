import os
from dotenv import load_dotenv

load_dotenv()

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER", "***REMOVED_API_KEY***")
SMTP_PASS = os.getenv("SMTP_PASS", "***REMOVED_API_KEY*** ***REMOVED_API_KEY*** ***REMOVED_API_KEY*** ***REMOVED_API_KEY***")
FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USER)
BASE_URL = os.getenv("BASE_URL", "http://localhost:6060")

JENKINS_USER = os.getenv("JENKINS_USER")
JENKINS_TOKEN = os.getenv("JENKINS_TOKEN")
JENKINS_URL = os.getenv("JENKINS_URL", "http://localhost:8090")
JENKINS_JOB_PATH = os.getenv("JENKINS_JOB_PATH")
JENKINS_JOB_PATH_CHECK = os.getenv("JENKINS_JOB_PATH_CHECK")
JENKINS_JOB_PATH_DESTROY = os.getenv("JENKINS_JOB_PATH_DESTROY")