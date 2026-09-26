<?php
/**
 * SKE MAILER CONFIG — cPanel Hosting Email SMTP
 * ─────────────────────────────────────────────────────────────
 * IMPORTANT: Never commit this file to a public Git repository.
 * This file is protected from browser access via .htaccess.
 * ─────────────────────────────────────────────────────────────
 *
 * HOW TO FIND YOUR cPANEL EMAIL PASSWORD:
 *   1. Log in to your hosting control panel (cPanel)
 *   2. Go to: Email Accounts
 *   3. Find info@sreekrishnaenterprizes.com → click "Manage"
 *   4. You can set/reset the password there
 *   5. Paste that password below
 */

define('SKE_SMTP_HOST',     'mail.sreekrishnaenterprizes.com');
define('SKE_SMTP_PORT',     587);                                    // STARTTLS port (try 465 if 587 fails)
define('SKE_SMTP_USERNAME', 'info@sreekrishnaenterprizes.com');      // Full cPanel email address
define('SKE_SMTP_PASSWORD', 'PASTE_YOUR_CPANEL_EMAIL_PASSWORD_HERE'); // cPanel email account password

define('SKE_FROM_EMAIL',    'info@sreekrishnaenterprizes.com');
define('SKE_FROM_NAME',     'SKE Website Enquiry');

// Owner email(s) — all will receive the notification
define('SKE_NOTIFY_EMAILS', [
    'infoskeindiaerd@gmail.com',
    'arunskeindiaerd@gmail.com',
]);

// Basic rate limit — max submissions per IP per hour
define('SKE_RATE_LIMIT',    10);

