import os
import resend
from django.conf import settings

resend_key = getattr(settings, 'RESEND_API_KEY', os.getenv('RESEND_API_KEY'))
if resend_key:
    resend.api_key = resend_key

def send_contact_email(name, email, message):
    from_sender = getattr(settings, 'RESEND_FROM_EMAIL', os.getenv('RESEND_FROM_EMAIL', "Sujal's Portfolio <verify@sujalsvs.in>"))
    
    try:
        resend.Emails.send({
            "from": from_sender,
            "to": ["svss.officia13@gmail.com"],
            "subject": f"🚀 Portfolio Contact - {name}",
            "html": f"""
            <h2>New Verified Portfolio Contact Message</h2>
            <hr>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> <a href="mailto:{email}">{email}</a></p>
            <p><strong>Message:</strong></p>
            <div style="background: #f4f4f5; padding: 12px; border-radius: 8px;">{message}</div>
            <hr>
            <p style="color: #71717a; font-size: 12px;">Sent from S V S SUJAL Portfolio System</p>
            """
        })
    except Exception as e:
        print(f"Error in send_contact_email: {e}")
