import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Configure nodemailer with SMTP from env
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email to site owner
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_TO,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;background:#f9f9f9;border-radius:8px;">
          <h2 style="color:#2563eb;">New Contact Form Submission</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> <a href="mailto:${email}" style="color:#2563eb;text-decoration:underline;">${email}</a></p>
          <p><b>Message:</b></p>
          <div style="background:#fff;border-radius:6px;padding:16px 12px;margin:12px 0;border:1px solid #eee;white-space:pre-line;">${message.replace(/\n/g, '<br/>')}</div>
          <hr style="margin:24px 0;"/>
          <p style="font-size:13px;color:#888;">This message was sent from the contact form on <a href="https://purniapulse.com" style="color:#2563eb;">purniapulse.com</a>.</p>
        </div>
      `,
    });

    // Auto-reply to user
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Thank you for reaching out to PurniaPulse',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;background:#f9f9f9;border-radius:8px;">
          <h2 style="color:#2563eb;">Thank you for contacting PurniaPulse!</h2>
          <p>Hi ${name},</p>
          <p>We have received your message and our team will get back to you as soon as possible.</p>
          <hr style="margin:24px 0;"/>
          <p style="font-size:14px;color:#666;">This is an automated reply. For urgent queries, email us at <a href="mailto:mail.purniapulse@gmail.com">mail.purniapulse@gmail.com</a>.</p>
          <p style="font-size:14px;color:#666;">Best regards,<br/>The PurniaPulse Team</p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error('Contact API error:', err, {
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER,
      CONTACT_TO: process.env.CONTACT_TO,
    });
    return NextResponse.json({ message: 'Failed to send message', error: (err as Error).message }, { status: 500 });
  }
}
