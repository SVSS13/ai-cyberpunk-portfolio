import os
"""
Email OTP Verification Service
Generates, caches, emails, and validates 6-digit OTP verification codes.
"""

import time
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from django.conf import settings
from .email_verifier import verify_email_address

# In-memory OTP storage: { email: { "otp": "123456", "expires_at": timestamp, "attempts": 0 } }
OTP_STORE = {}
OTP_RATE_TRACKER = {}

def generate_otp() -> str:
    """Generate a 6-digit cryptographic OTP."""
    return str(secrets.randbelow(900000) + 100000)

def send_verification_email(to_email: str, subject: str, html_body: str, plain_text: str = ""):
    """Send email with multi-provider fallback (Resend API -> Gmail SMTP)."""
    errors = []
    
    # 1. Try Resend API
    resend_key = getattr(settings, 'RESEND_API_KEY', os.getenv('RESEND_API_KEY'))
    if resend_key:
        try:
            import resend
            resend.api_key = resend_key
            resend.Emails.send({
                "from": "Portfolio Verification <onboarding@resend.dev>",
                "to": [to_email],
                "subject": subject,
                "html": html_body
            })
            return True
        except Exception as e:
            errors.append(f"Resend: {e}")

    # 2. Try Gmail SMTP
    user = getattr(settings, 'EMAIL_HOST_USER', os.getenv('EMAIL_HOST_USER', 'svss.officia13@gmail.com'))
    password = getattr(settings, 'EMAIL_HOST_PASSWORD', os.getenv('EMAIL_HOST_PASSWORD'))
    if user and password:
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"Sujal's Portfolio <{user}>"
            msg['To'] = to_email
            if plain_text:
                msg.attach(MIMEText(plain_text, 'plain'))
            if html_body:
                msg.attach(MIMEText(html_body, 'html'))
                
            server = smtplib.SMTP('smtp.gmail.com', 587, timeout=10)
            server.starttls()
            server.login(user, password)
            server.sendmail(user, [to_email], msg.as_string())
            server.quit()
            return True
        except Exception as e:
            errors.append(f"SMTP: {e}")
            
    print(f"Email dispatch warnings: {errors}")
    return False


def request_email_otp(name: str, email: str):
    """
    Validates email and sends a 6-digit OTP code to the visitor's inbox.
    """
    # 1. Check syntax, disposable domains, and DNS MX
    is_valid, msg, suggestion = verify_email_address(email)
    if not is_valid:
        return False, msg
        
    email_clean = email.strip().lower()
    now = time.time()
    
    # 2. Rate limiting (max 4 OTP requests per 10 mins per email)
    if email_clean in OTP_RATE_TRACKER:
        requests = [t for t in OTP_RATE_TRACKER[email_clean] if now - t < 600]
        if len(requests) >= 4:
            return False, "Too many OTP requests. Please wait a few minutes before trying again."
        OTP_RATE_TRACKER[email_clean] = requests + [now]
    else:
        OTP_RATE_TRACKER[email_clean] = [now]
        
    # 3. Generate & store OTP (valid for 10 minutes)
    otp = generate_otp()
    OTP_STORE[email_clean] = {
        "otp": otp,
        "expires_at": now + 600,
        "attempts": 0,
        "name": name.strip()
    }
    
    # 4. Build and send HTML email
    subject = f"🔐 {otp} is your Portfolio Verification Code"
    html_content = f"""
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 28px; background: #0c0d12; border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; color: #f3f4f6;">
        <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 36px;">⚔️</span>
            <h2 style="color: #ffb7c5; margin: 8px 0 4px; font-size: 22px; font-weight: 800; letter-spacing: -0.02em;">Sujal's Portfolio Verification</h2>
            <p style="color: #9ca3af; font-size: 13px; margin: 0;">Identity & Message Security System</p>
        </div>
        
        <p style="color: #e5e7eb; font-size: 15px; line-height: 1.6;">Hello <strong>{name}</strong>,</p>
        <p style="color: #9ca3af; font-size: 14px; line-height: 1.6;">Use the one-time code below to verify your email address and send your message to Sujal:</p>
        
        <div style="background: rgba(255,183,197,0.08); border: 1px dashed #ffb7c5; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 0.25em; color: #38bdf8; font-family: monospace;">{otp}</span>
            <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0;">⏱️ This code will expire in <strong>10 minutes</strong>.</p>
        </div>
        
        <p style="color: #6b7280; font-size: 12px; line-height: 1.5;">If you did not request this verification code, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 20px 0;">
        <div style="text-align: center; color: #6b7280; font-size: 11px;">
            S V S SUJAL • Bengaluru, India • <a href="https://svs-sujal-portfolio.vercel.app" style="color: #38bdf8; text-decoration: none;">svs-sujal-portfolio.vercel.app</a>
        </div>
    </div>
    """
    
    try:
        send_verification_email(to_email=email_clean, subject=subject, html_body=html_content, plain_text=f"Your verification code is: {otp}")
        return True, f"A 6-digit verification code was sent to {email_clean}."
    except Exception as e:
        print(f"Failed to send OTP email: {e}")
        return False, "Failed to send verification code to your email. Please verify that the address is correct."


def verify_otp_and_forward_message(name: str, email: str, message: str, user_otp: str):
    """
    Validates user OTP code. If correct, forwards the message to Sujal's inbox.
    """
    email_clean = email.strip().lower()
    user_otp = str(user_otp).strip()
    
    if email_clean not in OTP_STORE:
        return False, "No active verification code found for this email. Please request a new code."
        
    record = OTP_STORE[email_clean]
    
    # Check expiry
    if time.time() > record["expires_at"]:
        del OTP_STORE[email_clean]
        return False, "Verification code has expired. Please request a new code."
        
    # Check max attempts (3 max)
    if record["attempts"] >= 3:
        del OTP_STORE[email_clean]
        return False, "Too many incorrect attempts. Please request a new verification code."
        
    if record["otp"] != user_otp:
        record["attempts"] += 1
        remaining = 3 - record["attempts"]
        return False, f"Invalid verification code. {remaining} attempt(s) remaining."
        
    # OTP MATCHED! Clean up storage
    del OTP_STORE[email_clean]
    
    # Forward verified message to Sujal
    sujal_email = "svss.officia13@gmail.com"
    subject = f"🚀 [VERIFIED CONTACT] Message from {name}"
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; color: #1f2937;">
        <h2 style="color: #111827; margin-top: 0;">✨ New Verified Contact Message</h2>
        <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 12px 16px; border-radius: 6px; margin: 16px 0;">
            <p style="margin: 0; color: #065f46; font-size: 14px; font-weight: 600;">
                ✅ Sender Email Identity Verified via 6-Digit OTP Handshake
            </p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr>
                <td style="padding: 8px 0; color: #6b7280; width: 90px; font-size: 14px;"><strong>Name:</strong></td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">{name}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; color: #2563eb; font-size: 14px;"><a href="mailto:{email_clean}">{email_clean}</a></td>
            </tr>
        </table>
        
        <h3 style="color: #374151; font-size: 15px; margin-bottom: 8px;">Message:</h3>
        <div style="background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; color: #111827; white-space: pre-wrap;">{message}</div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">Sent via S V S SUJAL Interactive Portfolio System</p>
    </div>
    """
    
    plain_msg = f"Verified message from {name} ({email_clean}):\n\n{message}"
    try:
        send_verification_email(to_email=sujal_email, subject=subject, html_body=html_content, plain_text=plain_msg)
    except Exception as e:
        print(f"Error forwarding verified email to Sujal: {e}")
        
    return True, "Email verified and message delivered successfully!"
