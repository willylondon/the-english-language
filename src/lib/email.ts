import nodemailer from 'nodemailer';
import { formatPrice, formatTime } from './utils';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.SMTP_FROM || 'The English Language <lessons@theenglishlanguage.com>';
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';
const SITE_NAME = process.env.SITE_NAME || 'The English Language';

function baseTemplate(title: string, body: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: #1e40af; padding: 32px 24px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; }
    .header p { color: #bfdbfe; margin: 8px 0 0; font-size: 14px; }
    .body { padding: 32px 24px; }
    .body h2 { color: #1e293b; font-size: 20px; margin-top: 0; }
    .body p { color: #475569; line-height: 1.6; margin: 12px 0; }
    .detail-box { background: #f1f5f9; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #64748b; font-size: 14px; font-weight: 500; }
    .detail-value { color: #1e293b; font-size: 14px; font-weight: 600; }
    .btn { display: inline-block; background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 16px 0; }
    .bank-box { background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .bank-box h3 { color: #92400e; margin-top: 0; }
    .footer { background: #f1f5f9; padding: 24px; text-align: center; }
    .footer p { color: #94a3b8; font-size: 12px; margin: 4px 0; }
    .reference { background: #2563eb; color: #ffffff; display: inline-block; padding: 8px 16px; border-radius: 4px; font-family: monospace; font-size: 16px; letter-spacing: 2px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${SITE_NAME}</h1>
      <p>Expert English &amp; Language Arts Tutoring</p>
    </div>
    <div class="body">
      ${body}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</p>
      <p><a href="${SITE_URL}" style="color: #2563eb;">Visit our website</a></p>
    </div>
  </div>
</body>
</html>`;
}

interface BookingEmailData {
  studentName: string;
  parentName: string;
  parentEmail: string;
  classTitle: string;
  programmeName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  priceJMD: number;
  referenceNumber: string;
  meetingLink?: string;
}

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  // Preferred: Resend HTTP API (works on serverless, no SMTP needed)
  if (process.env.RESEND_API_KEY) {
    try {
      const resendFrom = `The English Language <lessons@${process.env.RESEND_EMAIL_DOMAIN || 'farikaatkins.online'}>`;
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from: resendFrom, to, subject, html }),
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error('Resend send failed:', res.status, errText);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Failed to send email via Resend:', error);
      return false;
    }
  }

  // Fallback: SMTP via nodemailer
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('\n📧 EMAIL (dev mode - not sent):');
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log('   (Configure RESEND_API_KEY or SMTP_USER/SMTP_PASS to send real emails)\n');
    return true;
  }

  try {
    await transporter.sendMail({
      from: FROM,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

export async function sendBookingReceivedEmail(data: BookingEmailData): Promise<boolean> {
  const bankName = process.env.BANK_NAME || 'National Commercial Bank (NCB)';
  const bankAccountName = process.env.BANK_ACCOUNT_NAME || 'The English Language';
  const bankAccountNumber = process.env.BANK_ACCOUNT_NUMBER || '000000000';
  const bankBranch = process.env.BANK_BRANCH || 'Kingston';

  const html = baseTemplate('Booking Received', `
    <h2>Thank you for booking, ${data.parentName}! 🎓</h2>
    <p>We've received your booking for <strong>${data.studentName}</strong>. Here are the details:</p>

    <p style="text-align: center;"><span class="reference">${data.referenceNumber}</span></p>

    <div class="detail-box">
      <table width="100%" cellpadding="6" cellspacing="0">
        <tr><td style="color:#64748b">Programme</td><td style="color:#1e293b;font-weight:600" align="right">${data.programmeName}</td></tr>
        <tr><td style="color:#64748b">Class</td><td style="color:#1e293b;font-weight:600" align="right">${data.classTitle}</td></tr>
        <tr><td style="color:#64748b">Schedule</td><td style="color:#1e293b;font-weight:600" align="right">${data.dayOfWeek}, ${formatTime(data.startTime)} – ${formatTime(data.endTime)}</td></tr>
        <tr><td style="color:#64748b">Amount Due</td><td style="color:#1e293b;font-weight:600" align="right">${formatPrice(data.priceJMD)}</td></tr>
      </table>
    </div>

    <div class="bank-box">
      <h3>💳 Bank Transfer Details</h3>
      <p style="color:#92400e;margin:4px 0"><strong>Bank:</strong> ${bankName}</p>
      <p style="color:#92400e;margin:4px 0"><strong>Account Name:</strong> ${bankAccountName}</p>
      <p style="color:#92400e;margin:4px 0"><strong>Account Number:</strong> ${bankAccountNumber}</p>
      <p style="color:#92400e;margin:4px 0"><strong>Branch:</strong> ${bankBranch}</p>
      <p style="color:#92400e;margin:12px 0 0;font-size:13px">Please use reference <strong>${data.referenceNumber}</strong> in your transfer description.</p>
    </div>

    <p>After completing your transfer, please upload a screenshot of your receipt on our website:</p>

    <p style="text-align: center;">
      <a href="${SITE_URL}/book/${data.referenceNumber}/upload" class="btn">Upload Receipt</a>
    </p>

    <p style="color:#94a3b8;font-size:13px">Please complete your payment within 12 hours to secure your spot. Unpaid bookings will be automatically released.</p>
  `);

  return sendEmail(data.parentEmail, `Booking Received — ${data.classTitle} | ${SITE_NAME}`, html);
}

export async function sendReceiptUploadedAdminEmail(data: BookingEmailData): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@theenglishlanguage.com';

  const html = baseTemplate('New Receipt Uploaded', `
    <h2>📋 New Receipt Uploaded</h2>
    <p>A parent has uploaded a bank transfer receipt for review.</p>

    <div class="detail-box">
      <table width="100%" cellpadding="6" cellspacing="0">
        <tr><td style="color:#64748b">Reference</td><td style="color:#1e293b;font-weight:600" align="right">${data.referenceNumber}</td></tr>
        <tr><td style="color:#64748b">Student</td><td style="color:#1e293b;font-weight:600" align="right">${data.studentName}</td></tr>
        <tr><td style="color:#64748b">Parent</td><td style="color:#1e293b;font-weight:600" align="right">${data.parentName}</td></tr>
        <tr><td style="color:#64748b">Class</td><td style="color:#1e293b;font-weight:600" align="right">${data.classTitle}</td></tr>
        <tr><td style="color:#64748b">Amount</td><td style="color:#1e293b;font-weight:600" align="right">${formatPrice(data.priceJMD)}</td></tr>
      </table>
    </div>

    <p style="text-align: center;">
      <a href="${SITE_URL}/admin/bookings" class="btn">Review Booking</a>
    </p>
  `);

  return sendEmail(adminEmail, `Receipt Uploaded — ${data.studentName} | ${data.referenceNumber}`, html);
}

export async function sendBookingConfirmedEmail(data: BookingEmailData): Promise<boolean> {
  const meetingSection = data.meetingLink
    ? `<p>📹 <strong>Meeting Link:</strong> <a href="${data.meetingLink}" style="color:#2563eb">${data.meetingLink}</a></p>`
    : '<p style="color:#64748b;font-size:13px">Your meeting link will be shared before the first class.</p>';

  const html = baseTemplate('Booking Confirmed', `
    <h2>✅ Payment Verified — You're In!</h2>
    <p>Great news, ${data.parentName}! We've verified your payment and <strong>${data.studentName}</strong> is confirmed for class.</p>

    <div class="detail-box">
      <table width="100%" cellpadding="6" cellspacing="0">
        <tr><td style="color:#64748b">Reference</td><td style="color:#1e293b;font-weight:600" align="right">${data.referenceNumber}</td></tr>
        <tr><td style="color:#64748b">Programme</td><td style="color:#1e293b;font-weight:600" align="right">${data.programmeName}</td></tr>
        <tr><td style="color:#64748b">Class</td><td style="color:#1e293b;font-weight:600" align="right">${data.classTitle}</td></tr>
        <tr><td style="color:#64748b">Schedule</td><td style="color:#1e293b;font-weight:600" align="right">${data.dayOfWeek}, ${formatTime(data.startTime)} – ${formatTime(data.endTime)}</td></tr>
      </table>
    </div>

    ${meetingSection}

    <p>We look forward to helping ${data.studentName} excel! If you have any questions, don't hesitate to reach out.</p>
  `);

  return sendEmail(data.parentEmail, `Confirmed! ${data.studentName} is booked for ${data.classTitle} | ${SITE_NAME}`, html);
}

export async function sendBookingRejectedEmail(data: BookingEmailData): Promise<boolean> {
  const html = baseTemplate('Payment Issue', `
    <h2>Payment Verification Issue</h2>
    <p>Hi ${data.parentName},</p>
    <p>Unfortunately, we were unable to verify the payment receipt for <strong>${data.studentName}</strong>'s booking (Reference: ${data.referenceNumber}).</p>

    <p>This could be due to:</p>
    <ul>
      <li>The receipt image being unclear or incomplete</li>
      <li>The transferred amount not matching the class fee</li>
      <li>The transfer not yet reflecting in our account</li>
    </ul>

    <p>Please contact us to resolve this and secure your spot:</p>

    <p style="text-align: center;">
      <a href="${SITE_URL}/contact" class="btn">Contact Us</a>
    </p>
  `);

  return sendEmail(data.parentEmail, `Payment Issue — Booking ${data.referenceNumber} | ${SITE_NAME}`, html);
}

export async function sendClassReminderEmail(data: BookingEmailData): Promise<boolean> {
  const html = baseTemplate('Class Reminder', `
    <h2>⏰ Class Tomorrow!</h2>
    <p>Hi ${data.parentName},</p>
    <p>This is a friendly reminder that <strong>${data.studentName}</strong> has class tomorrow:</p>

    <div class="detail-box">
      <table width="100%" cellpadding="6" cellspacing="0">
        <tr><td style="color:#64748b">Class</td><td style="color:#1e293b;font-weight:600" align="right">${data.classTitle}</td></tr>
        <tr><td style="color:#64748b">Time</td><td style="color:#1e293b;font-weight:600" align="right">${formatTime(data.startTime)} – ${formatTime(data.endTime)}</td></tr>
      </table>
    </div>

    ${data.meetingLink ? `<p style="text-align:center"><a href="${data.meetingLink}" class="btn">Join Class</a></p>` : ''}

    <p>See you there! 📚</p>
  `);

  return sendEmail(data.parentEmail, `Reminder: ${data.classTitle} Tomorrow | ${SITE_NAME}`, html);
}
