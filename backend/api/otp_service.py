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
            from_sender = getattr(settings, "RESEND_FROM_EMAIL", os.getenv("RESEND_FROM_EMAIL", "Sujal's Portfolio <verify@sujalsvs.in>"))
            resend.Emails.send({
                "from": from_sender,
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
    
    # 4. Build and send HTML email with Naruto vs Sasuke Shinobi Theme
    subject = f"⚡ {otp} - Shinobi Seal Verification Code"
    avatar_url = "https://raw.githubusercontent.com/SVSS13/ai-cyberpunk-portfolio/main-V5/frontend/src/assets/profile.png"
    html_content = f"""
    <div style="background-color: #06070c; padding: 32px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; min-height: 100%;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; margin: 0 auto; background: #0c0e17; border: 1px solid #232742; border-radius: 20px; overflow: hidden; box-shadow: 0 16px 48px rgba(0,0,0,0.85);">
            <!-- Top Clash Banner (Rasengan Cyan vs Chidori Violet + Profile Avatar) -->
            <tr>
                <td style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #170928 100%); padding: 30px 24px 24px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08); position: relative;">
                    <!-- Sujal Profile Avatar -->
                    <div style="margin-bottom: 14px; text-align: center;">
                        <img src="{avatar_url}" alt="SVS Sujal" width="68" height="68" style="width: 68px; height: 68px; border-radius: 50%; object-fit: cover; border: 2px solid #38bdf8; box-shadow: 0 0 20px rgba(56,189,248,0.5); display: inline-block;" />
                    </div>
                    <div style="margin-bottom: 12px;">
                        <span style="display: inline-block; padding: 4px 14px; border-radius: 9999px; background: rgba(56,189,248,0.15); border: 1px solid #38bdf8; color: #38bdf8; font-size: 11px; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; margin-right: 6px;">🍥 Rasengan</span>
                        <span style="color: #64748b; font-size: 12px; font-weight: 700;">VS</span>
                        <span style="display: inline-block; padding: 4px 14px; border-radius: 9999px; background: rgba(168,85,247,0.15); border: 1px solid #a855f7; color: #c084fc; font-size: 11px; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; margin-left: 6px;">⚡ Chidori</span>
                    </div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: -0.02em; text-shadow: 0 0 20px rgba(56,189,248,0.4);">
                        SHINOBI SEAL VERIFICATION
                    </h1>
                    <p style="margin: 6px 0 0; color: #94a3b8; font-size: 13px; font-weight: 500;">
                        S V S Sujal • Transmission Gateway • 忍 印
                    </p>
                </td>
            </tr>

            <!-- Body Content -->
            <tr>
                <td style="padding: 28px 28px 24px;">
                    <p style="margin: 0 0 14px; color: #e2e8f0; font-size: 15px; line-height: 1.6;">
                        Greetings, <strong style="color: #38bdf8;">{name}</strong>,
                    </p>
                    <p style="margin: 0 0 24px; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                        To deliver your transmission across the Valley of the End and directly into Sujal's verified terminal, channel the one-time Jutsu seal below:
                    </p>

                    <!-- Glowing Chakra OTP Box -->
                    <div style="background: linear-gradient(135deg, rgba(56,189,248,0.08) 0%, rgba(168,85,247,0.08) 100%); border: 2px solid #38bdf8; border-radius: 16px; padding: 24px 16px; text-align: center; margin: 20px 0; box-shadow: 0 0 24px rgba(56,189,248,0.2);">
                        <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: #c084fc; margin-bottom: 8px;">
                            ⚡ 6-DIGIT CHAKRA CODE ⚡
                        </div>
                        <div style="font-family: 'SF Mono', Consolas, Monaco, monospace; font-size: 38px; font-weight: 900; letter-spacing: 0.28em; color: #38bdf8; text-shadow: 0 0 12px rgba(56,189,248,0.6); margin: 6px 0;">
                            {otp}
                        </div>
                        <p style="margin: 10px 0 0; color: #64748b; font-size: 12px; font-weight: 600;">
                            ⏳ Jutsu Seal expires in <span style="color: #f43f5e; font-weight: 700;">10 minutes</span>
                        </p>
                    </div>

                    <p style="margin: 20px 0 0; color: #64748b; font-size: 12px; line-height: 1.5; text-align: center;">
                        If you did not initiate this transmission, no chakra has been spent and you may safely disregard this scroll.
                    </p>
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td style="padding: 16px 28px 24px; background: #080a10; border-top: 1px solid rgba(255,255,255,0.06); text-align: center;">
                    <div style="color: #64748b; font-size: 11px; margin-bottom: 4px;">
                        <span style="color: #38bdf8;">🍃 Hidden Leaf Village</span> • S V S SUJAL • Bengaluru, India
                    </div>
                    <a href="https://svs-sujal-portfolio.vercel.app" style="color: #a855f7; text-decoration: none; font-size: 11px; font-weight: 700;">
                        svs-sujal-portfolio.vercel.app
                    </a>
                </td>
            </tr>
        </table>
    </div>
    """
    
    try:
        send_verification_email(to_email=email_clean, subject=subject, html_body=html_content, plain_text=f"Your Shinobi Seal Verification Code is: {otp}")
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
    
    # Forward verified message to Sujal with Shinobi Scroll Theme
    sujal_email = "svss.officia13@gmail.com"
    subject = f"⚡ [SHINOBI SEAL VERIFIED] Transmission from {name}"
    avatar_url = "https://raw.githubusercontent.com/SVSS13/ai-cyberpunk-portfolio/main/frontend/src/assets/profile.png"
    html_content = f"""
    <div style="background-color: #06070c; padding: 32px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; min-height: 100%;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background: #0c0e17; border: 1px solid #232742; border-radius: 18px; overflow: hidden; color: #f8fafc; box-shadow: 0 16px 48px rgba(0,0,0,0.85);">
            <tr>
                <td style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #170928 100%); padding: 24px 28px; border-bottom: 1px solid #312e81;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                            <td width="64" valign="middle" style="padding-right: 14px;">
                                <img src="{avatar_url}" alt="SVS Sujal" width="56" height="56" style="width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 2px solid #38bdf8; box-shadow: 0 0 16px rgba(56,189,248,0.5); display: block;" />
                            </td>
                            <td valign="middle">
                                <div style="display: inline-block; padding: 3px 10px; border-radius: 6px; background: rgba(16,185,129,0.15); border: 1px solid #10b981; color: #34d399; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px;">
                                    ✓ 忍 OTP IDENTITY AUTHENTICATED
                                </div>
                                <h2 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: -0.02em;">
                                    New Shinobi Transmission
                                </h2>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding: 24px 28px;">
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <tr>
                            <td style="padding: 8px 0; color: #94a3b8; font-size: 13px; width: 100px; font-weight: 700;">Sender:</td>
                            <td style="padding: 8px 0; color: #f8fafc; font-size: 14px; font-weight: 700;">{name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #94a3b8; font-size: 13px; font-weight: 700;">Email:</td>
                            <td style="padding: 8px 0; color: #38bdf8; font-size: 14px; font-weight: 700;"><a href="mailto:{email_clean}" style="color: #38bdf8; text-decoration: none;">{email_clean}</a></td>
                        </tr>
                    </table>

                    <div style="color: #cbd5e1; font-size: 12px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px;">
                        📜 Transmission Message:
                    </div>
                    <div style="background: #131724; border: 1px solid #232a40; border-radius: 12px; padding: 18px; font-size: 14px; line-height: 1.7; color: #e2e8f0; white-space: pre-wrap;">{message}</div>
                </td>
            </tr>
            <tr>
                <td style="padding: 16px 28px; background: #080a10; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; color: #64748b; font-size: 11px;">
                    Dispatched via S V S SUJAL Shinobi Security Gateway • <a href="https://svs-sujal-portfolio.vercel.app" style="color: #818cf8; text-decoration: none;">svs-sujal-portfolio.vercel.app</a>
                </td>
            </tr>
        </table>
    </div>
    """
    
    plain_msg = f"Verified message from {name} ({email_clean}):\n\n{message}"
    try:
        send_verification_email(to_email=sujal_email, subject=subject, html_body=html_content, plain_text=plain_msg)
    except Exception as e:
        print(f"Error forwarding verified email to Sujal: {e}")

    # Also dispatch official delivery receipt to visitor
    receipt_subject = "⚡ Transmission Received - S V S Sujal"
    receipt_html = f"""
    <div style="background-color: #06070c; padding: 32px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; min-height: 100%;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; margin: 0 auto; background: #0c0e17; border: 1px solid #232742; border-radius: 20px; overflow: hidden; box-shadow: 0 16px 48px rgba(0,0,0,0.85);">
            <tr>
                <td style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #170928 100%); padding: 30px 24px 24px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08);">
                    <div style="margin-bottom: 14px; text-align: center;">
                        <img src="{avatar_url}" alt="SVS Sujal" width="68" height="68" style="width: 68px; height: 68px; border-radius: 50%; object-fit: cover; border: 2px solid #38bdf8; box-shadow: 0 0 20px rgba(56,189,248,0.5); display: inline-block;" />
                    </div>
                    <div style="margin-bottom: 10px;">
                        <span style="display: inline-block; padding: 4px 14px; border-radius: 9999px; background: rgba(34,197,94,0.15); border: 1px solid #22c55e; color: #4ade80; font-size: 11px; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase;">✓ TRANSMISSION DELIVERED</span>
                    </div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 900; letter-spacing: -0.02em;">
                        Thank You for Connecting!
                    </h1>
                    <p style="margin: 6px 0 0; color: #94a3b8; font-size: 13px;">
                        S V S Sujal • AI & Software Engineer
                    </p>
                </td>
            </tr>
            <tr>
                <td style="padding: 28px 28px 24px;">
                    <p style="margin: 0 0 14px; color: #e2e8f0; font-size: 15px; line-height: 1.6;">
                        Hi <strong style="color: #38bdf8;">{name}</strong>,
                    </p>
                    <p style="margin: 0 0 18px; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                        Your message has been authenticated and delivered directly to Sujal's primary terminal. Sujal will review your transmission and get back to you shortly.
                    </p>
                    <div style="background: #131724; border: 1px solid #232a40; border-radius: 12px; padding: 16px; margin: 16px 0; font-size: 13px; line-height: 1.6; color: #cbd5e1; font-style: italic;">
                        "{message}"
                    </div>
                </td>
            </tr>
            <tr>
                <td style="padding: 16px 28px; background: #080a10; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; color: #64748b; font-size: 11px;">
                    <span style="color: #38bdf8;">🍃 S V S SUJAL</span> • Bengaluru, India • <a href="https://svs-sujal-portfolio.vercel.app" style="color: #a855f7; text-decoration: none;">svs-sujal-portfolio.vercel.app</a>
                </td>
            </tr>
        </table>
    </div>
    """
    try:
        send_verification_email(to_email=email_clean, subject=receipt_subject, html_body=receipt_html, plain_text=f"Hi {name}, your message has been delivered to Sujal. He will review it and reply soon.")
    except Exception as e:
        print(f"Error sending confirmation receipt to visitor: {e}")
        
    return True, "Email verified and message delivered successfully!"
