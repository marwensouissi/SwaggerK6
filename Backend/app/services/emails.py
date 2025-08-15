import os
import smtplib
from email.message import EmailMessage
from urllib.parse import urljoin
from typing import Tuple
from email.mime.multipart import MIMEMultipart
from app.config.config import SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL, BASE_URL


def build_verification_link(token: str) -> str:
    """
    Build the verification URL sent in email.
    Example: http://localhost:6060/users/verify?token=abc123
    """
    return f"{BASE_URL.rstrip('/')}/users/verify?token={token}"


def send_verification_email(email_to: str, username: str, token: str) -> Tuple[bool, str]:
    """
    Sends verification email to the user.
    Returns (sent:boolean, message:string)
    """
    link = build_verification_link(token)

    msg = EmailMessage()
    msg["Subject"] = "Verify your email"
    msg["From"] = FROM_EMAIL
    msg["To"] = email_to

    # HTML content for email
    msg.set_content(f"""
Hello {username},

Please verify your account by clicking the link below:

{link}

This link expires in 24 hours.

If you didn't request this, ignore this email.
""")
    msg.add_alternative(f"""
<html>
  <body>
    <p>Hello <b>{username}</b>,</p>
    <p>Please verify your account by clicking the link below:</p>
    <p><a href="{link}">{link}</a></p>
    <p>This link expires in 24 hours.</p>
    <p>If you didn't request this, ignore this email.</p>
  </body>
</html>
""", subtype="html")

    try:
        # Connect to Gmail SMTP with TLS
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)
        print(f"[EMAIL SENT] Verification email sent to {email_to}")
        return True, "Email sent"
    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send email to {email_to}: {e}")
        return False, f"send-failed: {e}. Verification link: {link}"