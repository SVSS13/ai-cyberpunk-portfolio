from django.core.mail import send_mail

from django.conf import settings


def send_contact_email(
    name,
    email,
    message
):

    subject = (
        f"🚀 Portfolio Contact - {name}"
    )

    email_message = f"""

New Portfolio Contact Message

==================================

Name:
{name}

----------------------------------

Email:
{email}

----------------------------------

Message:

{message}

==================================

Sent from:
S V S SUJAL Portfolio System

"""

    send_mail(

        subject=subject,

        message=email_message,

        from_email=settings.EMAIL_HOST_USER,

        recipient_list=[
            settings.EMAIL_HOST_USER
        ],

        fail_silently=False,

    )