const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();
const PORT = process.env.PORT || 10000;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Frontend Serve (NEW!) ────────────────────────────────────
app.use(express.static(path.join(__dirname)));

// ─── Gmail Transporter ───────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  family: 4,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

// ─── Health Check ─────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'Thenvyx Backend Running ✅' });
});

// ─── Contact Form API ─────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, subject, message, newsletter } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  const adminMailOptions = {
    from: `"Thenvyx Website" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: `📩 New Contact: ${subject} — from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0;">Thenvyx Tech</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 5px 0 0;">New Contact Form Submission</p>
        </div>
        <div style="padding: 30px; background: white; border-radius: 0 0 12px 12px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #667eea; font-weight: 600; width: 130px;">👤 Name</td><td style="padding: 12px 0; border-bottom: 1px solid #eee;">${name}</td></tr>
            <tr><td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #667eea; font-weight: 600;">📧 Email</td><td style="padding: 12px 0; border-bottom: 1px solid #eee;"><a href="mailto:${email}" style="color: #667eea;">${email}</a></td></tr>
            <tr><td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #667eea; font-weight: 600;">📱 Phone</td><td style="padding: 12px 0; border-bottom: 1px solid #eee;">${phone || 'Not provided'}</td></tr>
            <tr><td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #667eea; font-weight: 600;">📋 Subject</td><td style="padding: 12px 0; border-bottom: 1px solid #eee;">${subject}</td></tr>
            <tr><td style="padding: 12px 0; color: #667eea; font-weight: 600;">📰 Newsletter</td><td style="padding: 12px 0;">${newsletter === 'on' ? '✅ Subscribed' : '❌ Not subscribed'}</td></tr>
          </table>
          <div style="margin-top: 20px; background: #f8f9fc; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
            <p style="color: #667eea; font-weight: 600; margin: 0 0 8px;">💬 Message</p>
            <p style="color: #555; margin: 0; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">© 2026 Thenvyx Tech | ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
        </div>
      </div>
    `,
  };

  const clientMailOptions = {
    from: `"Thenvyx Tech" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `✅ We received your message, ${name}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0;">Thenvyx Tech</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 5px 0 0;">Message Received!</p>
        </div>
        <div style="padding: 30px; background: white; border-radius: 0 0 12px 12px;">
          <h2 style="color: #333;">Hi ${name}! 👋</h2>
          <p style="color: #555; line-height: 1.8;">Thank you for reaching out. We'll get back to you within <strong style="color: #667eea;">24–48 business hours</strong>.</p>
          <div style="background: #f8f9fc; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
            <p style="color: #667eea; font-weight: 600; margin: 0 0 5px;">Your Enquiry</p>
            <p style="color: #666; margin: 0;"><strong>Subject:</strong> ${subject}</p>
          </div>
          <p style="color: #555;">📧 <a href="mailto:teamthenvyx@gmail.com" style="color: #667eea;">teamthenvyx@gmail.com</a></p>
          <div style="text-align: center; margin-top: 25px;">
            <a href="mailto:teamthenvyx@gmail.com" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 12px 30px; border-radius: 25px; text-decoration: none; font-weight: 600;">Reply to Us</a>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 20px; text-align: center;">© 2026 Thenvyx Tech | All Rights Reserved</p>
        </div>
      </div>
    `,
  };

  try {
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(clientMailOptions),
    ]);
    console.log(`✅ Contact form submitted by ${name} (${email})`);
    res.status(200).json({ success: true, message: "Thank you! Your message has been sent successfully. We'll get back to you soon!" });
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    res.status(500).json({ success: false, message: 'Oops! Something went wrong. Please try again later.' });
  }
});

// ─── All other routes → index.html ───────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ─── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Thenvyx Backend running at http://localhost:${PORT}`);
});
