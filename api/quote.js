/**
 * SKE India - Vercel Serverless Function: /api/quote
 * -------------------------------------------------------------
 * Secure server-side email dispatch for "Request a Quote".
 * Reads credentials strictly from environment variables.
 * Never exposes secrets or passwords to frontend client.
 * -------------------------------------------------------------
 */

const https = require('https');
const http = require('http');
const url = require('url');

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Only POST requests are accepted.'
    });
  }

  try {
    const body = req.body || {};
    const fullName = (body.fullName || body.name || '').trim();
    const companyName = (body.companyName || body.company || '').trim();
    const phone = (body.phone || body.phone_number || '').trim();
    const email = (body.email || body.email_address || '').trim();
    const productService = (body.productService || body.product || body.service || '').trim();
    const quantity = (body.quantity || '').trim();
    const message = (body.message || body.requirements || '').trim();

    // Server-side validation
    const errors = [];
    if (!fullName || fullName.length < 2) errors.push('Full Name is required.');
    if (!phone || phone.length < 6) errors.push('Valid Phone Number is required.');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) errors.push('Valid Email Address is required.');
    if (!productService || productService.length < 2) errors.push('Product / Service is required.');
    if (!message || message.length < 4) errors.push('Message / Requirements are required.');

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Unable to submit your request. Please try again.',
        errors: errors
      });
    }

    // Format Date and Time
    const now = new Date();
    const dateTimeStr = now.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }) + ' IST';

    const notifyEmail = process.env.NOTIFICATION_EMAIL || 'infoskeindiaerd@gmail.com';
    const emailSubject = process.env.EMAIL_SUBJECT || 'New Request for Quote – SKE India';
    const webhookUrl = process.env.FORWARD_WEBHOOK_URL || 'https://formspree.io/f/xaendkbd';
    const resendApiKey = process.env.RESEND_API_KEY;

    let emailDelivered = false;

    // 1. If Resend API Key is provided
    if (resendApiKey) {
      try {
        const emailHtml = generateEmailHtml({
          fullName,
          companyName,
          phone,
          email,
          productService,
          quantity,
          message,
          dateTimeStr
        });

        const resendPayload = JSON.stringify({
          from: 'SKE Quote Request <onboarding@resend.dev>',
          to: [notifyEmail],
          reply_to: email,
          subject: emailSubject,
          html: emailHtml
        });

        await makeHttpRequest({
          url: 'https://api.resend.com/emails',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
          },
          body: resendPayload
        });

        emailDelivered = true;
      } catch (e) {
        console.error('Resend delivery error:', e);
      }
    }

    // 2. Fallback / Standard Delivery via Webhook Relay
    if (!emailDelivered && webhookUrl) {
      try {
        const formData = new URLSearchParams({
          '_subject': emailSubject,
          'Full Name': fullName,
          'Company Name': companyName || 'Not Specified',
          'Phone Number': phone,
          'Email Address': email,
          'Product / Service': productService,
          'Quantity': quantity || 'Not Specified',
          'Message / Requirements': message,
          'Enquiry Date and Time': dateTimeStr,
          '_replyto': email
        }).toString();

        await makeHttpRequest({
          url: webhookUrl,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'User-Agent': 'SKE-Serverless/1.0'
          },
          body: formData
        });

        emailDelivered = true;
      } catch (err) {
        console.error('Webhook relay error:', err);
      }
    }

    if (emailDelivered) {
      return res.status(200).json({
        success: true,
        message: 'Thank you! Your quote request has been submitted successfully. Our team will contact you shortly.'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Unable to submit your request. Please try again.'
      });
    }

  } catch (error) {
    console.error('Quote API Handler Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to submit your request. Please try again.'
    });
  }
};

/**
 * Generates professional HTML email template
 */
function generateEmailHtml(data) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>New Request for Quote – SKE India</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
      <tr>
        <td style="background: #3B0764; padding: 25px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 0.5px;">SREE KRISHNA ENTERPRIZES</h1>
          <p style="color: #D8B4FE; margin: 5px 0 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">New Request for Quote</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 25px;">
          <div style="background: #FEF3C7; border-left: 4px solid #D97706; padding: 12px 16px; margin-bottom: 20px; border-radius: 4px;">
            <p style="margin: 0; color: #92400E; font-size: 14px; font-weight: bold;">
              Enquiry Received: ${data.dateTimeStr}
            </p>
          </div>
          <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #edf2f7;">
              <td style="width: 38%; color: #64748b; font-weight: bold; font-size: 14px;">Full Name:</td>
              <td style="color: #0f172a; font-size: 14px; font-weight: bold;">${data.fullName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #edf2f7;">
              <td style="color: #64748b; font-weight: bold; font-size: 14px;">Company Name:</td>
              <td style="color: #0f172a; font-size: 14px;">${data.companyName || '—'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #edf2f7;">
              <td style="color: #64748b; font-weight: bold; font-size: 14px;">Phone Number:</td>
              <td style="color: #0f172a; font-size: 14px;">
                <a href="tel:${data.phone}" style="color: #7C3AED; text-decoration: none; font-weight: bold;">${data.phone}</a>
                &nbsp;|&nbsp;
                <a href="https://wa.me/${data.phone.replace(/[^0-9]/g, '')}" style="color: #16A34A; text-decoration: none; font-weight: bold;">WhatsApp</a>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #edf2f7;">
              <td style="color: #64748b; font-weight: bold; font-size: 14px;">Email Address:</td>
              <td style="color: #0f172a; font-size: 14px;">
                <a href="mailto:${data.email}" style="color: #7C3AED; text-decoration: none;">${data.email}</a>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #edf2f7;">
              <td style="color: #64748b; font-weight: bold; font-size: 14px;">Product / Service:</td>
              <td style="color: #0f172a; font-size: 14px; font-weight: bold; color: #4C1D95;">${data.productService}</td>
            </tr>
            <tr style="border-bottom: 1px solid #edf2f7;">
              <td style="color: #64748b; font-weight: bold; font-size: 14px;">Quantity:</td>
              <td style="color: #0f172a; font-size: 14px;">${data.quantity || '—'}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding-top: 15px;">
                <p style="margin: 0 0 6px 0; color: #64748b; font-weight: bold; font-size: 14px;">Message / Requirements:</p>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 6px; color: #1e293b; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.message}</div>
              </td>
            </tr>
          </table>
          <div style="margin-top: 25px; text-align: center;">
            <a href="mailto:${data.email}?subject=Re: Your Quote Request for ${encodeURIComponent(data.productService)} - SKE India" 
               style="background: #7C3AED; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 14px;">
              Reply to Customer
            </a>
          </div>
        </td>
      </tr>
      <tr>
        <td style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 15px; text-align: center; color: #94a3b8; font-size: 12px;">
          Sree Krishna Enterprizes • Erode, India • SKE Automated Enquiry System
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

/**
 * Pure Node.js HTTPS request helper (Zero dependency)
 */
function makeHttpRequest({ url: targetUrl, method, headers, body }) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(targetUrl);
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: method || 'POST',
      headers: headers || {}
    };

    const client = parsed.protocol === 'https:' ? https : http;
    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}
