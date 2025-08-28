import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Configure nodemailer with Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // 'mail.purniapulse@gmail.com'
      pass: process.env.GMAIL_PASS,
    },
  });

  await transporter.sendMail({
  from: 'mail.purniapulse@gmail.com',
  to: 'mail.purniapulse@gmail.com',
  subject: `📩 New Contact Form Submission from ${name}`,
  html: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;">
      <h2 style="color:#2563eb;">New Contact Form Submission</h2>
      <table style="width:100%;margin-top:16px;">
        <tr>
          <td style="font-weight:bold;width:120px;">Name:</td>
          <td>${name}</td>
        </tr>
        <tr>
          <td style="font-weight:bold;">Email:</td>
          <td>${email}</td>
        </tr>
        <tr>
          <td style="font-weight:bold;vertical-align:top;">Message:</td>
          <td>${message.replace(/\n/g, '<br/>')}</td>
        </tr>
      </table>
      <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;"/>
      <p style="font-size:12px;color:#888;">This email was generated from the contact form on PurniaPulse.</p>
    </div>
  `
});

await transporter.sendMail({
  from: 'mail.purniapulse@gmail.com',
  to: email,
  subject: '🙏 Thank You for Contacting PurniaPulse',
  html: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;background:#f9f9f9;border-radius:8px;border:1px solid #e5e7eb;">
      <h2 style="color:#2563eb;">Thank You for Contacting PurniaPulse!</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>We’ve received your message and our team will get back to you as soon as possible.</p>
      <p style="margin-top:16px;">In the meantime, feel free to explore our website or follow us on social media for updates.</p>
      <hr style="margin:24px 0;border:none;border-top:1px solid #ddd;"/>
      <p style="font-size:14px;color:#666;">📌 This is an automated reply. For urgent queries, please email us directly at <a href="mailto:mail.purniapulse@gmail.com">mail.purniapulse@gmail.com</a>.</p>
      <p style="font-size:14px;color:#666;">Warm regards,<br/><strong>The PurniaPulse Team</strong></p>
    </div>
  `
});

  return res.status(200).json({ message: 'Message sent successfully' });
}
