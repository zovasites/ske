#!/usr/bin/env python3
"""
SKE India - Local Development & API Server
Serves static website assets and processes /api/quote and /api/enquiry POST requests.
Emails are securely dispatched to infoskeindiaerd@gmail.com.
"""

import http.server
import socketserver
import os
import json
import urllib.request
import urllib.parse
import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

PORT = int(os.environ.get("PORT", 3000))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load .env file manually if exists
env_path = os.path.join(BASE_DIR, ".env")
if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())

class SKEHttpHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_POST(self):
        parsed_path = urllib.parse.urlparse(self.path).path
        if parsed_path in ["/api/quote", "/api/quote.js", "/api/quote.php", "/api/enquiry", "/api/enquiry.php"]:
            self.handle_quote_api()
        else:
            self.send_error(404, "Endpoint Not Found")

    def handle_quote_api(self):
        content_len = int(self.headers.get("Content-Length", 0))
        post_body = self.rfile.read(content_len).decode("utf-8")

        try:
            if self.headers.get("Content-Type", "").startswith("application/json"):
                data = json.loads(post_body)
            else:
                parsed_qs = urllib.parse.parse_qs(post_body)
                data = {k: v[0] for k, v in parsed_qs.items()}
        except Exception:
            self.send_json_response(400, {
                "success": False,
                "message": "Unable to submit your request. Please try again."
            })
            return

        full_name = data.get("fullName") or data.get("name") or ""
        company_name = data.get("companyName") or data.get("company") or ""
        phone = data.get("phone") or data.get("phone_number") or ""
        email = data.get("email") or data.get("email_address") or ""
        product_service = data.get("productService") or data.get("product") or data.get("service") or ""
        quantity = data.get("quantity") or ""
        message = data.get("message") or data.get("requirements") or ""

        # Validate
        errors = []
        if len(full_name.strip()) < 2:
            errors.append("Full Name is required.")
        if len(phone.strip()) < 6:
            errors.append("Phone Number is required.")
        if "@" not in email or "." not in email:
            errors.append("Valid Email Address is required.")
        if len(product_service.strip()) < 2:
            errors.append("Product / Service is required.")
        if len(message.strip()) < 4:
            errors.append("Message / Requirements are required.")

        if errors:
            self.send_json_response(400, {
                "success": False,
                "message": "Unable to submit your request. Please try again.",
                "errors": errors
            })
            return

        now_str = datetime.datetime.now().strftime("%d %b %Y, %I:%M %p IST")
        notify_email = os.environ.get("NOTIFICATION_EMAIL", "infoskeindiaerd@gmail.com")
        subject = os.environ.get("EMAIL_SUBJECT", "New Request for Quote – SKE India")
        webhook_url = os.environ.get("FORWARD_WEBHOOK_URL", "https://formspree.io/f/xaendkbd")

        email_delivered = False

        # Attempt 1: Direct SMTP if configured in .env
        smtp_host = os.environ.get("SMTP_HOST", "")
        smtp_user = os.environ.get("SMTP_USER", "")
        smtp_pass = os.environ.get("SMTP_PASS", "")
        smtp_port = int(os.environ.get("SMTP_PORT", 587))

        if smtp_pass and smtp_pass != "PASTE_YOUR_CPANEL_EMAIL_PASSWORD_HERE":
            try:
                msg = MIMEMultipart("alternative")
                msg["Subject"] = subject
                msg["From"] = smtp_user or "info@sreekrishnaenterprizes.com"
                msg["To"] = notify_email
                msg["Reply-To"] = email

                html_content = f"""
                <html>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 20px;">
                  <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden;">
                    <div style="background: #3B0764; color: #fff; padding: 20px; text-align: center;">
                      <h2 style="margin: 0;">SREE KRISHNA ENTERPRIZES</h2>
                      <p style="margin: 5px 0 0 0; color: #D8B4FE; font-size: 13px;">NEW REQUEST FOR QUOTE</p>
                    </div>
                    <div style="padding: 25px;">
                      <div style="background: #FEF3C7; border-left: 4px solid #D97706; padding: 10px; margin-bottom: 20px;">
                        <strong>Enquiry Received:</strong> {now_str}
                      </div>
                      <p><strong>Full Name:</strong> {full_name}</p>
                      <p><strong>Company Name:</strong> {company_name or '—'}</p>
                      <p><strong>Phone Number:</strong> {phone}</p>
                      <p><strong>Email Address:</strong> {email}</p>
                      <p><strong>Product / Service:</strong> {product_service}</p>
                      <p><strong>Quantity:</strong> {quantity or '—'}</p>
                      <p><strong>Message / Requirements:</strong></p>
                      <div style="background: #f8fafc; padding: 12px; border: 1px solid #e2e8f0; border-radius: 4px;">{message}</div>
                    </div>
                  </div>
                </body>
                </html>
                """
                msg.attach(MIMEText(html_content, "html"))

                with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
                    server.starttls()
                    server.login(smtp_user, smtp_pass)
                    server.send_message(msg)
                email_delivered = True
                print(f"[SMTP SUCCESS] Dispatched quote request to {notify_email}")
            except Exception as e:
                print(f"[SMTP NOTICE] Direct SMTP failed ({e}), falling back to secure relay...")

        # Attempt 2: Secure server-side relay
        if not email_delivered and webhook_url:
            try:
                payload = {
                    "_subject": subject,
                    "Full Name": full_name,
                    "Company Name": company_name or "Not Specified",
                    "Phone Number": phone,
                    "Email Address": email,
                    "Product / Service": product_service,
                    "Quantity": quantity or "Not Specified",
                    "Message / Requirements": message,
                    "Enquiry Date and Time": now_str,
                    "_replyto": email
                }
                encoded_data = urllib.parse.urlencode(payload).encode("utf-8")
                req = urllib.request.Request(
                    webhook_url,
                    data=encoded_data,
                    headers={
                        "Accept": "application/json",
                        "User-Agent": "SKE-Server/1.0"
                    }
                )
                with urllib.request.urlopen(req, timeout=10) as resp:
                    if 200 <= resp.status < 300:
                        email_delivered = True
                        print(f"[RELAY SUCCESS] Dispatched quote request for {full_name} to {notify_email}")
            except Exception as e:
                print(f"[RELAY ERROR] Failed to dispatch email via relay: {e}")

        if email_delivered:
            self.send_json_response(200, {
                "success": True,
                "message": "Thank you! Your quote request has been submitted successfully. Our team will contact you shortly."
            })
        else:
            self.send_json_response(500, {
                "success": False,
                "message": "Unable to submit your request. Please try again."
            })

    def send_json_response(self, status_code, data):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode("utf-8"))

def run_server():
    os.chdir(BASE_DIR)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), SKEHttpHandler) as httpd:
        print(f"==================================================")
        print(f"  SKE INDIA DEVELOPMENT SERVER RUNNING")
        print(f"  Local URL: http://localhost:{PORT}")
        print(f"  Quote API: http://localhost:{PORT}/api/quote")
        print(f"==================================================")
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()
