const express = require('express');
const cors = require('cors');
const path = require('path');
const { Resend } = require('resend');

// Production-ல Render variables use பண்ணும், local-ல .env use பண்ணும்
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();
const PORT = process.env.PORT || 10000;
const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Frontend Serve ───────────────────────────────────────────
app.use(express.static(path.join(__dirname)));

// ─── Health Check ─────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'Thenvyx Backend Running ✅' });
});

// ─── Contact Form API ─────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, subject, message, newsletter } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please fill in all required fields.',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address.',
    });
  }

  try {
    // Admin mail
    await resend.emails.send({
      from: 'Thenvyx Website <onboarding@resend.dev>',
      to: process.env.GMAIL_USER,
      subject: `📩 New Contact: ${subject} — from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fc; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Thenvyx Tech</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 5px 0 0;">New Contact Form Submission</p>
          </div>
          <div style="padding: 30px; background: white; margin: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #667eea; font-weight: 600; width: 130px;">👤 Name</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #667eea; font-weight: 600;">📧 Email</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333;"><a href="mailto:${email}" style="color: #667eea;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #667eea; font-weight: 600;">📱 Phone</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333;">${phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #667eea; font-weight: 600;">📋 Subject</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333;">${subject}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #667eea; font-weight: 600;">📰 Newsletter</td>
                <td style="padding: 12px 0; color: #333;">${newsletter === 'on' ? '✅ Subscribed' : '❌ Not subscribed'}</td>
              </tr>
            </table>
            <div style="margin-top: 20px; background: #f8f9fc; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
              <p style="color: #667eea; font-weight: 600; margin: 0 0 8px;">💬 Message</p>
              <p style="color: #555; margin: 0; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>© 2026 Thenvyx Tech | Received at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
          </div>
        </div>
      `,
    });

    // Client confirmation mail
    await resend.emails.send({
      from: 'Thenvyx Tech <onboarding@resend.dev>',
      to: email,
      subject: `✅ We received your message, ${name}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fc; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Thenvyx Tech</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 5px 0 0;">Message Received!</p>
          </div>
          <div style="padding: 30px; background: white; margin: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <h2 style="color: #333; margin-bottom: 15px;">Hi ${name}! 👋</h2>
            <p style="color: #555; line-height: 1.8;">Thank you for reaching out to us. We have received your message and our team will get back to you within <strong style="color: #667eea;">24–48 business hours</strong>.</p>
            <div style="background: #f8f9fc; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <p style="color: #667eea; font-weight: 600; margin: 0 0 5px;">Your Enquiry</p>
              <p style="color: #666; margin: 0;"><strong>Subject:</strong> ${subject}</p>
            </div>
            <p style="color: #555; line-height: 1.8;">Meanwhile, feel free to connect with us:</p>
            <p style="color: #555;">📧 <a href="mailto:teamthenvyx@gmail.com" style="color: #667eea;">teamthenvyx@gmail.com</a></p>
            <div style="text-align: center; margin-top: 25px;">
              <a href="mailto:teamthenvyx@gmail.com" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 12px 30px; border-radius: 25px; text-decoration: none; font-weight: 600; display: inline-block;">Reply to Us</a>
            </div>
          </div>
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>© 2026 Thenvyx Tech | All Rights Reserved</p>
            <p>This is an automated reply. Please do not reply directly to this email.</p>
          </div>
        </div>
      `,
    });

    console.log(`✅ Contact form submitted by ${name} (${email})`);
    res.status(200).json({
      success: true,
      message: "Thank you! Your message has been sent successfully. We'll get back to you soon!",
    });

  } catch (error) {
    console.error('❌ Email send error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Oops! Something went wrong. Please try again later.',
    });
  }
});

// ─── All other routes → index.html ───────────────────────────
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ─── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Thenvyx Backend running at http://localhost:${PORT}`);
});
