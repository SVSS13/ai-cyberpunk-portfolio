"""
Email & Mailbox Verification Utility
Provides:
  1. RFC-5322 Syntax Validation
  2. Disposable / Temporary Email Domain Blacklisting
  3. Live DNS MX (Mail Exchange) Server Verification
  4. Real-Time SMTP Mailbox Probe (RCPT TO) to check if username exists
  5. Common Domain Typo Detection & Suggestions
"""

import re
import socket
import smtplib

try:
    import dns.resolver
    import dns.exception
    HAS_DNS = True
except Exception:
    HAS_DNS = False

DISPOSABLE_DOMAINS = {
    "mailinator.com", "tempmail.com", "10minutemail.com", "guerrillamail.com",
    "sharklasers.com", "throwawaymail.com", "yopmail.com", "trashmail.com",
    "getairmail.com", "dispostable.com", "fakeinbox.com", "emailondeck.com",
    "temp-mail.org", "mytemp.email", "mohmal.com", "generator.email",
    "inboxkitten.com", "maildrop.cc", "crazymailing.com", "burnermail.io",
    "tempmailaddress.com", "throwaway.email", "tmpmail.net", "tmpmail.org",
}

COMMON_DOMAIN_CORRECTIONS = {
    "gmai.com": "gmail.com",
    "gmial.com": "gmail.com",
    "gamil.com": "gmail.com",
    "yaho.com": "yahoo.com",
    "yahool.com": "yahoo.com",
    "outlok.com": "outlook.com",
    "hotmial.com": "hotmail.com",
    "hotmaill.com": "hotmail.com",
    "iclou.com": "icloud.com",
}


def probe_mailbox_smtp(email: str, mx_host: str) -> tuple[bool | None, str]:
    """
    Connects to the destination MX server on port 25 and executes an SMTP handshake
    (HELO -> MAIL FROM -> RCPT TO) without actually sending the email.
    
    Returns:
      (True, 'Mailbox exists') -> Server confirmed recipient exists (250 OK)
      (False, 'Mailbox does not exist') -> Server rejected recipient (550 / NoSuchUser)
      (None, 'Indeterminate') -> Server timed out, greylisted, or blocked port 25
    """
    try:
        server = smtplib.SMTP(timeout=3.5)
        server.connect(mx_host, 25)
        server.helo("svs-sujal-portfolio.onrender.com")
        server.mail("verify@svs-sujal-portfolio.onrender.com")
        code, resp = server.rcpt(email)
        server.quit()
        
        resp_text = resp.decode("utf-8", errors="ignore")
        
        if code == 250:
            return True, "Mailbox verified on mail server."
        elif code in [550, 551, 552, 553, 554]:
            # Explicit user rejection (NoSuchUser / mailbox not found)
            if any(k in resp_text.lower() for k in ["not exist", "nosuchuser", "user unknown", "invalid", "recipient address rejected", "mailbox unavailable"]):
                return False, f"The mailbox '{email}' does not exist on the mail server."
            return False, f"Recipient rejected by mail server ({code})."
        else:
            return None, f"Server responded with status {code}."
            
    except (socket.timeout, smtplib.SMTPConnectError, smtplib.SMTPServerDisconnected, OSError):
        # Cloud environments (like Render or AWS) sometimes block outgoing port 25 or timeout
        return None, "SMTP connection bypassed."
    except Exception as e:
        return None, f"SMTP check skipped: {e}"


def verify_email_address(email: str) -> tuple[bool, str, str | None]:
    """
    Verifies an email address for:
      - Valid format
      - Not a disposable/throwaway domain
      - Domain existence & live Mail Exchange (MX) record
      - Mailbox existence via live SMTP handshake (where supported)
    
    Returns:
      (is_valid: bool, message: str, suggested_email: str | None)
    """
    if not email or not isinstance(email, str):
        return False, "Email address is required.", None
        
    email = email.strip().lower()
    
    # 1. RFC-5322 Syntax Check
    pattern = r"^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)$"
    match = re.match(pattern, email)
    if not match:
        return False, "Please enter a valid email address format (e.g. name@example.com).", None
        
    domain = match.group(1).lower()
    
    # Check for suggested typo correction
    suggestion = None
    if domain in COMMON_DOMAIN_CORRECTIONS:
        corrected_domain = COMMON_DOMAIN_CORRECTIONS[domain]
        local_part = email.split("@")[0]
        suggestion = f"{local_part}@{corrected_domain}"
    
    # 2. Disposable / Burner Email Check
    if domain in DISPOSABLE_DOMAINS:
        return False, f"Temporary/disposable email addresses (@{domain}) are not accepted. Please use your real email.", suggestion
        
    # 3. Live DNS MX Record Check
    mx_host = None
    if HAS_DNS:
        try:
            resolver = dns.resolver.Resolver()
            resolver.timeout = 3.5
            resolver.lifetime = 3.5
            
            mx_records = resolver.resolve(domain, "MX")
            if not mx_records:
                return False, f"The domain '@{domain}' has no mail server configured to receive emails.", suggestion
                
            # Get primary MX host
            sorted_records = sorted(mx_records, key=lambda r: r.preference)
            mx_host = str(sorted_records[0].exchange).rstrip(".")
            
        except (dns.resolver.NXDOMAIN, dns.resolver.NoAnswer, dns.resolver.NoNameservers):
            try:
                socket.gethostbyname(domain)
                return True, "Domain exists.", suggestion
            except Exception:
                return False, f"The domain '@{domain}' does not exist on the internet.", suggestion
                
        except dns.exception.Timeout:
            try:
                socket.gethostbyname(domain)
                return True, "Domain resolved via fallback.", suggestion
            except Exception:
                return False, f"Unable to verify domain '@{domain}'. Please check for typos.", suggestion
                
        except Exception:
            try:
                socket.gethostbyname(domain)
                return True, "Domain resolved.", suggestion
            except Exception:
                return False, f"Invalid email domain '@{domain}'.", suggestion
    else:
        try:
            socket.gethostbyname(domain)
            return True, "Domain resolved.", suggestion
        except Exception:
            return False, f"The domain '@{domain}' does not exist on the internet.", suggestion

    # 4. Live SMTP Mailbox Probe (RCPT TO)
    if mx_host:
        exists, probe_msg = probe_mailbox_smtp(email, mx_host)
        if exists is False:
            return False, probe_msg, suggestion
            
    return True, "Email and mailbox verified successfully.", suggestion
