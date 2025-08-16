import os
import smtplib
from email.message import EmailMessage
from urllib.parse import urljoin
from typing import Tuple
from email.mime.multipart import MIMEMultipart
from app.config.config import SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL, BASE_URL
from datetime import datetime

def build_verification_link(token: str) -> str:
    """
    Build the verification URL sent in email.
    Example: http://localhost:6060/users/verify?token=abc123
    """
    return f"{BASE_URL.rstrip('/')}/users/verify?token={token}"

def send_verification_email(email_to: str, username: str, token: str) -> Tuple[bool, str]:
    """
    Sends verification email to the user with a professional design.
    Returns (sent:boolean, message:string)
    """
    link = build_verification_link(token)
    company_name = "KianTech"  # Replace with your actual company name
    support_email = "KianSupport@kian.com"  # Replace with your support email
    
    msg = EmailMessage()
    msg["Subject"] = f"{company_name} - Verify Your Email Address"
    msg["From"] = f"{company_name} <{FROM_EMAIL}>"  # Updated From header with display name
    msg["To"] = email_to

    # Plain text version (fallback)
    msg.set_content(f"""
Hello {username},

Thank you for registering with {company_name}! To complete your registration, 
please verify your email address by clicking the link below:

{link}

This verification link will expire in 24 hours.

If you didn't create an account with {company_name}, you can safely ignore this email.

Need help? Contact our support team at {support_email}

Thanks,
The {company_name} Team
""")

    # HTML version with professional design
    html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body {{
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f7f7f7;
        }}
        .container {{
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }}
        .header {{
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #eeeeee;
            margin-bottom: 20px;
        }}
        .logo {{
            max-width: 150px;
            height: auto;
        }}
        .content {{
            padding: 0 20px 20px;
        }}
        h1 {{
            color: #2c3e50;
            font-size: 24px;
            margin-top: 0;
        }}
        .button {{
            display: inline-block;
            padding: 12px 24px;
            background-color: #3498db;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin: 20px 0;
        }}
        .button:hover {{
            background-color: #2980b9;
        }}
        .footer {{
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #7f8c8d;
            border-top: 1px solid #eeeeee;
        }}
        .expiry-note {{
            color: #e74c3c;
            font-weight: bold;
        }}
        .support {{
            margin-top: 30px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 4px;
            font-size: 14px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <!-- Replace with your logo or company name -->
            <h1>{company_name}</h1>
        </div>
        
        <div class="content">
            <h1>Verify Your Email Address</h1>
            
            <p>Hello <strong>{username}</strong>,</p>
            
            <p>Thank you for registering with {company_name}! To complete your registration, 
            please verify your email address by clicking the button below:</p>
            
            <p style="text-align: center;">
                <a href="{link}" class="button">Verify Email Address</a>
            </p>
            
            <p class="expiry-note">This verification link will expire in 24 hours.</p>
            
            <p>If the button above doesn't work, copy and paste this link into your browser:</p>
            <p><a href="{link}" style="word-break: break-all;">{link}</a></p>
            
            <div class="support">
                <p>Need help? Contact our support team at <a href="mailto:{support_email}">{support_email}</a></p>
                <p>If you didn't create an account with {company_name}, you can safely ignore this email.</p>
            </div>
        </div>
        
        <div class="footer">
            <p>&copy; {datetime.now().year} {company_name}. All rights reserved.</p>
            <p>
                <a href="#">Privacy Policy</a> | 
                <a href="#">Terms of Service</a>
            </p>
        </div>
    </div>
</body>
</html>
"""
    msg.add_alternative(html_content, subtype="html")

    try:
        # Connect to SMTP server with TLS
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)
        print(f"[EMAIL SENT] Verification email sent to {email_to}")
        return True, "Email sent"
    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send email to {email_to}: {e}")
        return False, f"send-failed: {e}. Verification link: {link}"