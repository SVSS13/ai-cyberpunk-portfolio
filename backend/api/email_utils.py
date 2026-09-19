"""
Email Utilities
===============
Unified helper for sending notifications with multi-provider fallback.
"""

from .otp_service import send_verification_email


def send_contact_email(name: str, email: str, message: str) -> bool:
    """
    Dispatches a formatted transmission email directly to Sujal with multi-provider fallback.
    """
    avatar_url = "https://raw.githubusercontent.com/SVSS13/ai-cyberpunk-portfolio/main/frontend/src/assets/profile.png"
    subject = f"⚡ Shinobi Transmission from {name}"
    html_body = f"""
    <div style="background-color: #06070c; padding: 28px 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 580px; margin: 0 auto; background: #0c0e17; border: 1px solid #232742; border-radius: 18px; overflow: hidden; color: #f8fafc;">
            <tr>
                <td style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #170928 100%); padding: 22px 24px; border-bottom: 1px solid #312e81;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                            <td width="60" valign="middle" style="padding-right: 12px;">
                                <img src="{avatar_url}" alt="SVS Sujal" width="50" height="50" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid #38bdf8; display: block;" />
                            </td>
                            <td valign="middle">
                                <div style="display: inline-block; padding: 3px 10px; border-radius: 9999px; background: rgba(56,189,248,0.15); border: 1px solid #38bdf8; color: #38bdf8; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px;">
                                    🍥 NARUTO ✕ ⚡ SASUKE
                                </div>
                                <h2 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 800;">
                                    New Shinobi Transmission
                                </h2>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding: 24px;">
                    <p style="margin: 0 0 8px; font-size: 13px; color: #94a3b8;"><strong>Sender:</strong> <span style="color: #f8fafc;">{name}</span></p>
                    <p style="margin: 0 0 16px; font-size: 13px; color: #94a3b8;"><strong>Email:</strong> <a href="mailto:{email}" style="color: #38bdf8; text-decoration: none;">{email}</a></p>
                    <div style="font-size: 12px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #cbd5e1; margin-bottom: 6px;">📜 Transmission Message:</div>
                    <div style="background: #131724; border: 1px solid #232a40; border-radius: 10px; padding: 16px; font-size: 14px; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap;">{message}</div>
                </td>
            </tr>
            <tr>
                <td style="padding: 14px 24px; background: #080a10; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; color: #64748b; font-size: 11px;">
                    S V S SUJAL • Bengaluru, India • <a href="https://svs-sujal-portfolio.vercel.app" style="color: #818cf8; text-decoration: none;">svs-sujal-portfolio.vercel.app</a>
                </td>
            </tr>
        </table>
    </div>
    """
    plain_text = f"Message from {name} ({email}):\n\n{message}"
    return send_verification_email(
        to_email="svss.officia13@gmail.com",
        subject=subject,
        html_body=html_body,
        plain_text=plain_text
    )

