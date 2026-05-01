const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, subject, message, newsletter } = req.body;

  console.log('📩 Form received from:', email);
  console.log('GMAIL_USER:', process.env.GMAIL_USER);
  console.log('GMAIL_APP_PASS set:', !!process.env.GMAIL_APP_PASS);

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS,
    },
  });

  const istTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  try {
    // Email to team
    await transporter.sendMail({
      from: `"Thenvyx Website" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `New Contact: ${subject} from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
        <p><strong>Newsletter:</strong> ${newsletter === 'on' ? 'Yes' : 'No'}</p>
        <p><strong>Received:</strong> ${istTime} IST</p>
      `,
    });

    console.log('✅ Team email sent');

    // Confirmation to client
    await transporter.sendMail({
      from: `"Thenvyx Tech" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `We received your message, ${name}!`,
      html: `
        <h2>Hi ${name}!</h2>
        <p>Thank you for reaching out to Thenvyx Tech.</p>
        <p>We have received your message about <strong>${subject}</strong> and will get back to you within 24-48 business hours.</p>
        <p>Team Thenvyx<br>teamthenvyx@gmail.com</p>
      `,
    });

    console.log('✅ Client email sent to:', email);

    res.status(200).json({
      success: true,
      message: "Thank you! Your message has been sent successfully. We'll get back to you soon!",
    });

  } catch (error) {
    console.error('❌ Email error:', error.message);
    console.error('❌ Full error:', JSON.stringify(error));
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
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`GMAIL_USER: ${process.env.GMAIL_USER}`);
  console.log(`GMAIL_APP_PASS set: ${!!process.env.GMAIL_APP_PASS}`);
});
