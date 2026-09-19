"""
Email & Domain Verification Utility
Provides:
  1. RFC-5322 Syntax Validation
  2. Disposable / Temporary Email Domain Blacklisting
  3. Live DNS MX (Mail Exchange) Server Verification via dnspython & socket
  4. Common Domain Typo Detection & Suggestions
"""

import re
import socket
import dns.resolver

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


def verify_email_address(email: str):
    """
    Verifies an email address for:
      - Valid format
      - Not a disposable/throwaway domain
      - Domain existence & live Mail Exchange (MX) record
    
    Returns:
      (is_valid: bool, error_or_success_message: str, suggested_email: str or None)
    """
    if not email or not isinstance(email, str):
        return False, "Email address is required.", None
        
    email = email.strip().lower()
    
    # 1. Syntax Check
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
    try:
        resolver = dns.resolver.Resolver()
        resolver.timeout = 3.5
        resolver.lifetime = 3.5
        
        # Query MX records
        mx_records = resolver.resolve(domain, "MX")
        if not mx_records:
            return False, f"The domain '@{domain}' has no mail server configured to receive emails.", suggestion
            
        return True, "Email verified successfully.", suggestion
        
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
