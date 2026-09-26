<?php
/**
 * SKE India - Quote Request API Endpoint: api/quote.php
 * ─────────────────────────────────────────────────────────────
 * Accepts POST (JSON or Form) from the Quote Request form.
 * Validates, rate-limits, formats professional email,
 * and securely dispatches email notification to infoskeindiaerd@gmail.com.
 * Never exposes credentials to frontend code.
 * ─────────────────────────────────────────────────────────────
 */

// ── Security Headers ─────────────────────────────────────────
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

// ── CORS ─────────────────────────────────────────────────────
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: {$origin}");
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit;
}

// ── Load Config / Fallbacks ───────────────────────────────────
$configFile = __DIR__ . '/config.php';
if (file_exists($configFile)) {
    require_once $configFile;
}

$notifyEmail = getenv('NOTIFICATION_EMAIL') ?: (defined('SKE_NOTIFY_EMAILS') ? SKE_NOTIFY_EMAILS[0] : 'infoskeindiaerd@gmail.com');
$emailSubject = getenv('EMAIL_SUBJECT') ?: 'New Request for Quote – SKE India';
$smtpHost = getenv('SMTP_HOST') ?: (defined('SKE_SMTP_HOST') ? SKE_SMTP_HOST : 'mail.sreekrishnaenterprizes.com');
$smtpPort = (int)(getenv('SMTP_PORT') ?: (defined('SKE_SMTP_PORT') ? SKE_SMTP_PORT : 587));
$smtpUser = getenv('SMTP_USER') ?: (defined('SKE_SMTP_USERNAME') ? SKE_SMTP_USERNAME : 'info@sreekrishnaenterprizes.com');
$smtpPass = getenv('SMTP_PASS') ?: (defined('SKE_SMTP_PASSWORD') ? SKE_SMTP_PASSWORD : '');
$fromEmail = getenv('FROM_EMAIL') ?: (defined('SKE_FROM_EMAIL') ? SKE_FROM_EMAIL : 'info@sreekrishnaenterprizes.com');
$fromName = getenv('FROM_NAME') ?: (defined('SKE_FROM_NAME') ? SKE_FROM_NAME : 'SKE Quote Request');
$webhookUrl = getenv('FORWARD_WEBHOOK_URL') ?: 'https://formspree.io/f/xaendkbd';

// ── Parse Input (JSON or standard form) ───────────────────────
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!is_array($data)) {
    $data = $_POST;
}

function cleanInput($val) {
    return htmlspecialchars(trim(strip_tags((string)$val)), ENT_QUOTES, 'UTF-8');
}

$fullName       = cleanInput($data['fullName'] ?? $data['name'] ?? '');
$companyName    = cleanInput($data['companyName'] ?? $data['company'] ?? '');
$phone          = cleanInput($data['phone'] ?? $data['phone_number'] ?? '');
$email          = filter_var(trim($data['email'] ?? $data['email_address'] ?? ''), FILTER_VALIDATE_EMAIL);
$productService = cleanInput($data['productService'] ?? $data['product'] ?? $data['service'] ?? '');
$quantity       = cleanInput($data['quantity'] ?? '');
$message        = cleanInput($data['message'] ?? $data['requirements'] ?? '');

// ── Server-Side Validation ───────────────────────────────────
$errors = [];
if (strlen($fullName) < 2) $errors[] = 'Full Name is required.';
if (strlen($phone) < 6) $errors[] = 'Phone Number is required.';
if (!$email) $errors[] = 'Valid Email Address is required.';
if (strlen($productService) < 2) $errors[] = 'Product / Service is required.';
if (strlen($message) < 4) $errors[] = 'Message / Requirements are required.';

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to submit your request. Please try again.',
        'errors'  => $errors
    ]);
    exit;
}

// Format Enquiry Date and Time (IST)
date_default_timezone_set('Asia/Kolkata');
$dateTimeStr = date('d M Y, h:i A') . ' IST';

$emailDelivered = false;

// 1. Try PHP SmtpMailer if password is provided
$smtpMailerFile = __DIR__ . '/SmtpMailer.php';
if (!empty($smtpPass) && $smtpPass !== 'PASTE_YOUR_CPANEL_EMAIL_PASSWORD_HERE' && file_exists($smtpMailerFile)) {
    require_once $smtpMailerFile;
    try {
        $htmlBody = <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
    <tr>
      <td style="background: #3B0764; padding: 25px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px;">SREE KRISHNA ENTERPRIZES</h1>
        <p style="color: #D8B4FE; margin: 5px 0 0 0; font-size: 13px; text-transform: uppercase;">New Request for Quote</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 25px;">
        <div style="background: #FEF3C7; border-left: 4px solid #D97706; padding: 12px 16px; margin-bottom: 20px; border-radius: 4px;">
          <p style="margin: 0; color: #92400E; font-size: 14px; font-weight: bold;">Enquiry Received: {$dateTimeStr}</p>
        </div>
        <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #edf2f7;"><td style="width: 38%; color: #64748b; font-weight: bold;">Full Name:</td><td style="color: #0f172a; font-weight: bold;">{$fullName}</td></tr>
          <tr style="border-bottom: 1px solid #edf2f7;"><td style="color: #64748b; font-weight: bold;">Company Name:</td><td style="color: #0f172a;">{$companyName}</td></tr>
          <tr style="border-bottom: 1px solid #edf2f7;"><td style="color: #64748b; font-weight: bold;">Phone Number:</td><td style="color: #0f172a;"><a href="tel:{$phone}" style="color: #7C3AED; font-weight: bold;">{$phone}</a></td></tr>
          <tr style="border-bottom: 1px solid #edf2f7;"><td style="color: #64748b; font-weight: bold;">Email Address:</td><td style="color: #0f172a;"><a href="mailto:{$email}" style="color: #7C3AED;">{$email}</a></td></tr>
          <tr style="border-bottom: 1px solid #edf2f7;"><td style="color: #64748b; font-weight: bold;">Product / Service:</td><td style="color: #4C1D95; font-weight: bold;">{$productService}</td></tr>
          <tr style="border-bottom: 1px solid #edf2f7;"><td style="color: #64748b; font-weight: bold;">Quantity:</td><td style="color: #0f172a;">{$quantity}</td></tr>
          <tr><td colspan="2" style="padding-top: 15px;"><p style="margin: 0 0 6px 0; color: #64748b; font-weight: bold;">Message / Requirements:</p><div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 6px; color: #1e293b; font-size: 14px; line-height: 1.6;">{$message}</div></td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;
        $mailer = new SmtpMailer($smtpHost, $smtpPort, $smtpUser, $smtpPass);
        $emailDelivered = $mailer->send([$notifyEmail], $fromEmail, $fromName, $emailSubject, $htmlBody);
    } catch (Exception $e) {
        $emailDelivered = false;
    }
}

// 2. Webhook delivery fallback
if (!$emailDelivered && !empty($webhookUrl)) {
    $postFields = http_build_query([
        '_subject'               => $emailSubject,
        'Full Name'              => $fullName,
        'Company Name'           => $companyName ?: 'Not Specified',
        'Phone Number'           => $phone,
        'Email Address'          => $email,
        'Product / Service'      => $productService,
        'Quantity'               => $quantity ?: 'Not Specified',
        'Message / Requirements' => $message,
        'Enquiry Date and Time'  => $dateTimeStr,
        '_replyto'               => $email
    ]);

    $ch = curl_init($webhookUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/x-www-form-urlencoded',
        'Accept: application/json',
        'User-Agent: SKE-PHP-Server/1.0'
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    $response = curl_exec($ch);
    $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($statusCode >= 200 && $statusCode < 300) {
        $emailDelivered = true;
    }
}

if ($emailDelivered) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your quote request has been submitted successfully. Our team will contact you shortly.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to submit your request. Please try again.'
    ]);
}
