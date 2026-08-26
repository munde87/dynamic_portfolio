const nodemailer = require('nodemailer')
const https      = require('https')
const ContactMessage = require('../models/ContactMessage')
const Visitor    = require('../models/Visitor')
const { escapeHtml } = require('../utils/helpers')

const TARGET_EMAIL = process.env.EMAIL_TO || 'mundeshubham002@gmail.com'

const createTransporter = () => {
  const user = process.env.EMAIL_USER || 'mundeshubham002@gmail.com'
  const pass = process.env.EMAIL_PASS
  if (!pass) return null

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
  })
}

// Fail-safe HTTPS fallback to ensure email delivery even without SMTP credentials
const dispatchHttpsBackup = (name, email, message) => {
  return new Promise((resolve) => {
    try {
      const postData = JSON.stringify({
        access_key: 'b94ed05f-7e9b-449e-b816-17b0d774f762', // Public Web3Forms transmission key
        name: name,
        email: email,
        message: message,
        to_email: TARGET_EMAIL,
        subject: `🕷️ Web Transmission from ${name} — Portfolio`
      })

      const req = https.request({
        hostname: 'api.web3forms.com',
        path: '/submit',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        },
        timeout: 8000
      }, (res) => {
        let body = ''
        res.on('data', chunk => body += chunk)
        res.on('end', () => resolve(true))
      })

      req.on('error', (e) => {
        console.error('[HTTPS MAIL FALLBACK ERROR]:', e.message)
        resolve(false)
      })

      req.write(postData)
      req.end()
    } catch (err) {
      console.error('[HTTPS DISPATCH EXCEPTION]:', err.message)
      resolve(false)
    }
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

    // Save message to MongoDB so zero customer inquiries are ever lost (no unique index crash!)
    try {
      await ContactMessage.create({ name: safeName, email: safeEmail, message: safeMessage })
    } catch (dbErr) {
      console.warn('[DB SAVE WARN]:', dbErr.message)
    }

    // Respond immediately to client so UI never hangs
    res.status(200).json({ success: true, message: 'Message received! Thank you for reaching out.' })

    // 1. Try Nodemailer SMTP if EMAIL_PASS is present
    const transporter = createTransporter()
    if (transporter) {
      transporter.sendMail({
        from: `"${safeName}" <${process.env.EMAIL_USER || 'mundeshubham002@gmail.com'}>`,
        to: TARGET_EMAIL,
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
      }).catch(async (err) => {
        console.error('[NODEMAILER SMTP FAIL, DISPATCHING HTTPS BACKUP]:', err.message)
        await dispatchHttpsBackup(safeName, safeEmail, safeMessage)
      })
    } else {
      // 2. Dispatch via direct HTTPS API backup
      console.log('[SMTP CONFIG MISSING: DISPATCHING DIRECT HTTPS MAIL RELAY]')
      dispatchHttpsBackup(safeName, safeEmail, safeMessage)
    }

  } catch (err) {
    console.error('[CONTACT CONTROLLER ERROR]:', err)
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

    const safeName = escapeHtml(name)

    // Store visitor record without throwing duplicate key errors
    try {
      await Visitor.findOneAndUpdate(
        { email },
        { name: safeName, thankSent: true },
        { upsert: true, new: true }
      )
    } catch (vErr) {
      console.warn('[VISITOR UPSERT WARN]:', vErr.message)
    }

    // Respond immediately to client
    res.status(200).json({ success: true, message: 'Thank you email queued!' })

    // Send thank you mail asynchronously in background
    const transporter = createTransporter()
    if (transporter) {
      transporter.sendMail({
        from: `"Shubham Munde 🕷️" <${process.env.EMAIL_USER || 'mundeshubham002@gmail.com'}>`,
        to: email,
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