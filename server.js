const express = require('express');
const cors = require('cors');
const path = require('path');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();
const PORT = process.env.PORT || 10000;

const TEAM_EMAIL = 'teamthenvyx@gmail.com';
const TEAM_NAME = 'Thenvyx Tech';

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.get('/health', (req, res) => {
  res.json({ status: 'Thenvyx Backend Running ✅' });
});

async function sendEmail({ to, toName, subject, html }) {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: TEAM_NAME, email: TEAM_EMAIL },
      to: [{ email: to, name: toName }],
      subject,
      htmlContent: html,
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(data));
  return data;
}

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, subject, message, newsletter } = req.body;

  console.log('📩 Form received from:', email);

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  const istTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  try {
    // ── Email to Team ─────────────────────────────────────────
    await sendEmail({
      to: TEAM_EMAIL,
      toName: TEAM_NAME,
      subject: `📩 New Contact: ${subject} — from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fc; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Thenvyx Tech</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 5px 0 0;">New Contact Form Submission</p>
          </div>
          <div style="padding: 30px; background: white; margin: 20px; border-radius: 10px;">
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
            <p>© 2026 Thenvyx Tech | Received at ${istTime} IST</p>
          </div>
        </div>
      `,
    });

    console.log('✅ Team email sent');

    // ── Confirmation Email to Client ──────────────────────────
    await sendEmail({
      to: email,
      toName: name,
      subject: `✅ We received your message, ${name}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fc; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Thenvyx Tech</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 5px 0 0;">Message Received!</p>
          </div>
          <div style="padding: 30px; background: white; margin: 20px; border-radius: 10px;">
            <h2 style="color: #333; margin-bottom: 15px;">Hi ${name}! 👋</h2>
            <p style="color: #555; line-height: 1.8;">Thank you for reaching out to us. We have received your message and our team will get back to you within <strong style="color: #667eea;">24–48 business hours</strong>.</p>
            <div style="background: #f8f9fc; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <p style="color: #667eea; font-weight: 600; margin: 0 0 5px;">Your Enquiry</p>
              <p style="color: #666; margin: 0;"><strong>Subject:</strong> ${subject}</p>
            </div>
            <p style="color: #555; line-height: 1.8;">Meanwhile, feel free to connect with us:</p>
            <p style="color: #555;">📧 <a href="mailto:${TEAM_EMAIL}" style="color: #667eea;">${TEAM_EMAIL}</a></p>
            <div style="text-align: center; margin-top: 25px;">
              <a href="mailto:${TEAM_EMAIL}" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 12px 30px; border-radius: 25px; text-decoration: none; font-weight: 600; display: inline-block;">Reply to Us</a>
            </div>
          </div>
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>© 2026 Thenvyx Tech | All Rights Reserved</p>
          </div>
        </div>
      `,
    });

    console.log('✅ Client email sent to:', email);

    res.status(200).json({
      success: true,
      message: "Thank you! Your message has been sent successfully. We'll get back to you soon!",
    });

  } catch (error) {
    console.error('❌ Email error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Oops! Something went wrong. Please try again later.',
    });
  }
});

app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Thenvyx Backend running at http://localhost:${PORT}`);
});
