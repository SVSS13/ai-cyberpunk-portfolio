import resend

from django.conf import settings


resend.api_key = settings.RESEND_API_KEY


def send_contact_email(
    name,
    email,
    message
):

    resend.Emails.send({

        "from":
        "Portfolio <onboarding@resend.dev>",

        "to":
        ["svss.officia13@gmail.com"],

        "subject":
        f"🚀 Portfolio Contact - {name}",

        "html":
        f"""

        <h2>New Portfolio Contact Message</h2>

        <hr>

        <p>
        <strong>Name:</strong>
        {name}
        </p>

        <p>
        <strong>Email:</strong>
        {email}
        </p>

        <p>
        <strong>Message:</strong>
        </p>

        <p>
        {message}
        </p>

        <hr>

        <p>
        Sent from:
        S V S SUJAL Portfolio System
        </p>

        """

    })