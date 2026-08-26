const nodemailer    = require('nodemailer')
const Visitor       = require('../models/Visitor')
const { escapeHtml } = require('../utils/helpers')

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000,
  })
}

const sendContact = async (req, res) => {
  try {
    const { name, email, message } = req.body
    if (!name || !email || !message)
      return res.status(400).json({ success: false, message: 'All fields are required.' })

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ success: false, message: 'Invalid email format.' })

    const safeName    = escapeHtml(name)
    const safeEmail   = escapeHtml(email)
    const safeMessage = escapeHtml(message)

    // Respond immediately to the client so there is zero lag or waiting
    res.status(200).json({ success: true, message: 'Message received! Thank you for reaching out.' })

    // Dispatch email asynchronously in background
    const transporter = createTransporter()
    if (transporter) {
      transporter.sendMail({
        from:    `"${safeName}" <${process.env.EMAIL_USER}>`,
        to:      process.env.EMAIL_TO || 'mundeshubham002@gmail.com',
        replyTo: email,
        subject: `🕷️ Web Transmission from ${safeName} — Portfolio`,
        html: `
          <!DOCTYPE html>
          <html>
          <body style="margin:0;padding:0;background:#050811;font-family:'Segoe UI',Roboto,Helvetica,sans-serif">
            <div style="max-width:580px;margin:40px auto;border-radius:20px;overflow:hidden;border:2px solid rgba(230,36,41,0.4);background:#0B1120">
              <div style="background:linear-gradient(135deg,#050811 0%,#111A2E 100%);padding:36px 28px;text-align:center;border-bottom:2px solid rgba(230,36,41,0.3)">
                <h1 style="margin:0 0 8px;font-size:22px;color:#E62429;letter-spacing:2px;font-weight:800;text-transform:uppercase">New Message Payload</h1>
                <p style="margin:0;color:#2563EB;font-size:13px;font-weight:600">WEB-OS // INCOMING TRANSMISSION</p>
              </div>
              <div style="padding:28px">
                <p style="color:#E2E8F0;font-size:14px;"><strong>From:</strong> ${safeName} (${safeEmail})</p>
                <p style="color:#E2E8F0;font-size:14px;"><strong>Message:</strong></p>
                <div style="background:#111A2E;border-left:4px solid #E62429;padding:16px;margin:12px 0;">
                  <p style="color:#E2E8F0;font-size:14px;margin:0;white-space:pre-wrap">${safeMessage}</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
      }).catch(err => console.error('[CONTACT EMAIL BACKGROUND ERROR]:', err.message))
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Failed to process message.' })
  }
}

const thankVisitor = async (req, res) => {
  try {
    const { name = 'Developer', email } = req.body
    if (!email)
      return res.status(400).json({ success: false, message: 'Email is required.' })

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ success: false, message: 'Invalid email format.' })

    const existing = await Visitor.findOne({ email })
    if (existing && existing.thankSent)
      return res.status(200).json({ success: true, message: 'Already welcomed!' })

    const safeName = escapeHtml(name)

    // Store visitor record
    if (existing) {
      existing.thankSent = true
      await existing.save()
    } else {
      await Visitor.create({ name, email, thankSent: true })
    }

    // Respond immediately to client
    res.status(200).json({ success: true, message: 'Thank you email queued!' })

    // Send thank you mail asynchronously in background
    const transporter = createTransporter()
    if (transporter) {
      transporter.sendMail({
        from:    `"Shubham Munde 🕷️" <${process.env.EMAIL_USER}>`,
        to:      email,
        subject: '🕷️ Thank You for Visiting — Shubham Munde | Software Engineer',
        html: `
          <!DOCTYPE html>
          <html>
          <body style="margin:0;padding:0;background:#050811;font-family:'Segoe UI',Roboto,Helvetica,sans-serif">
            <div style="max-width:580px;margin:40px auto;border-radius:20px;overflow:hidden;border:2px solid rgba(230,36,41,0.4);background:#0B1120">
              <div style="background:linear-gradient(135deg,#050811 0%,#111A2E 100%);padding:40px 28px;text-align:center;border-bottom:2px solid rgba(230,36,41,0.3)">
                <h1 style="margin:0 0 8px;font-size:24px;color:#E62429;letter-spacing:1.5px;font-weight:800">Welcome, ${safeName}!</h1>
                <p style="margin:0;color:#2563EB;font-size:13px;font-weight:600">WITH GREAT CODE COMES GREAT RESPONSIBILITY</p>
              </div>
              <div style="padding:28px">
                <p style="color:#E2E8F0;font-size:14px;line-height:1.8">
                  Hey <strong>${safeName}</strong> — thank you for connecting! I am glad you visited my portfolio. Feel free to reach out anytime via email or LinkedIn!
                </p>
                <p style="color:#64748B;font-size:12px;margin-top:20px">— Shubham Munde (Full Stack Developer & AI Automation Enthusiast)</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }).catch(err => console.error('[VISITOR EMAIL BACKGROUND ERROR]:', err.message))
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Failed to send thank you email.' })
  }
}

module.exports = { sendContact, thankVisitor }