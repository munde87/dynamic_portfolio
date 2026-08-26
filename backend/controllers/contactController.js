const nodemailer    = require('nodemailer')
const Visitor       = require('../models/Visitor')
const { escapeHtml } = require('../utils/helpers')

const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

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

    await createTransporter().sendMail({
      from:    `"${safeName}" <${process.env.EMAIL_USER}>`,
      to:      process.env.EMAIL_TO || 'shubhammunde8767@gmail.com',
      replyTo: email,
      subject: `🕷️ Web Transmission from ${safeName} — Portfolio`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#050811;font-family:'Segoe UI',Roboto,Helvetica,sans-serif">
          <div style="max-width:580px;margin:40px auto;border-radius:20px;overflow:hidden;border:2px solid rgba(230,36,41,0.4);box-shadow:0 0 50px rgba(230,36,41,0.25);background:#0B1120">

            <!-- Header Banner -->
            <div style="background:linear-gradient(135deg,#050811 0%,#111A2E 100%);padding:42px 32px;text-align:center;border-bottom:2px solid rgba(230,36,41,0.3)">
              <div style="font-size:42px;margin-bottom:12px;line-height:1">🕷️</div>
              <h1 style="margin:0 0 8px;font-size:22px;color:#E62429;letter-spacing:2px;font-weight:800;text-transform:uppercase">New Message Payload</h1>
              <p style="margin:0;color:#2563EB;font-size:13px;font-weight:600">WEB-OS // INCOMING TRANSMISSION</p>
              <div style="height:2px;background:linear-gradient(90deg,transparent,#E62429,#2563EB,transparent);margin-top:20px"></div>
            </div>

            <!-- Body Content -->
            <div style="padding:32px">

              <!-- Sender Card -->
              <div style="background:#111A2E;border:1px solid rgba(37,99,235,0.3);border-radius:14px;padding:20px 24px;margin-bottom:24px">
                <p style="margin:0 0 14px;color:#E62429;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700">Sender Details</p>
                <table style="width:100%;border-collapse:collapse">
                  <tr>
                    <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);width:70px">
                      <span style="color:#64748B;font-size:12px;text-transform:uppercase;letter-spacing:1px">From</span>
                    </td>
                    <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
                      <span style="color:#F8FAFC;font-size:15px;font-weight:700">${safeName}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;width:70px">
                      <span style="color:#64748B;font-size:12px;text-transform:uppercase;letter-spacing:1px">Email</span>
                    </td>
                    <td style="padding:8px 0">
                      <a href="mailto:${safeEmail}" style="color:#2563EB;font-size:14px;text-decoration:none;font-weight:600">${safeEmail}</a>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Message Box -->
              <p style="color:#64748B;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;font-weight:700">Message Content</p>
              <div style="background:#111A2E;border-left:4px solid #E62429;border-radius:0 14px 14px 0;padding:20px 24px;margin-bottom:28px">
                <p style="color:#E2E8F0;font-size:15px;line-height:1.85;margin:0;white-space:pre-wrap">${safeMessage}</p>
              </div>

              <!-- Reply Action Button -->
              <div style="text-align:center">
                <a href="mailto:${safeEmail}?subject=Re: Your message&body=Hi ${safeName}," style="display:inline-block;background:linear-gradient(135deg,#E62429 0%,#B91C1C 100%);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:50px;font-size:14px;font-weight:800;letter-spacing:1px;box-shadow:0 4px 20px rgba(230,36,41,0.4)">
                  ↩ Reply to ${safeName}
                </a>
              </div>

            </div>

            <!-- Footer -->
            <div style="background:#050811;padding:20px 32px;text-align:center;border-top:1px solid rgba(230,36,41,0.2)">
              <p style="color:#64748B;font-size:11px;margin:0;line-height:1.6">
                Shubham Munde — Software Engineer 🕷️ &nbsp;•&nbsp; Reply to respond directly to ${safeName}
              </p>
            </div>

          </div>
        </body>
        </html>
      `,
    })

    res.status(200).json({ success: true, message: 'Message sent!' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Failed to send message.' })
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

    await createTransporter().sendMail({
      from:    `"Shubham Munde 🕷️" <${process.env.EMAIL_USER}>`,
      to:      email,
      subject: '🕷️ Thank You for Visiting — Shubham Munde | Software Engineer',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#050811;font-family:'Segoe UI',Roboto,Helvetica,sans-serif">
          <div style="max-width:580px;margin:40px auto;border-radius:20px;overflow:hidden;border:2px solid rgba(230,36,41,0.4);box-shadow:0 0 50px rgba(230,36,41,0.25);background:#0B1120">

            <!-- Header Banner -->
            <div style="background:linear-gradient(135deg,#050811 0%,#111A2E 100%);padding:48px 32px 36px;text-align:center;border-bottom:2px solid rgba(230,36,41,0.3)">
              <div style="font-size:52px;margin-bottom:12px;line-height:1">🕷️</div>
              <h1 style="margin:0 0 8px;font-size:28px;color:#E62429;letter-spacing:1.5px;font-weight:800">Welcome, ${safeName}!</h1>
              <p style="margin:0;color:#2563EB;font-size:14px;font-weight:600">WITH GREAT CODE COMES GREAT RESPONSIBILITY</p>
              <div style="height:2px;background:linear-gradient(90deg,transparent,#E62429,#2563EB,transparent);margin-top:24px"></div>
            </div>

            <!-- Body -->
            <div style="padding:36px 32px">

              <p style="color:#E2E8F0;font-size:15px;line-height:1.9;margin:0 0 18px">
                Hey <strong style="color:#E62429">${safeName}</strong> — thank you for connecting! 
                I'm genuinely glad you stopped by my portfolio. Every interaction is a reminder of why I love engineering applications and crafting modern web experiences. 🚀
              </p>

              <p style="color:#E2E8F0;font-size:15px;line-height:1.9;margin:0 0 30px">
                Whether you're exploring potential technical collaborations, full-time engineering roles, or simply checking out projects — I'd love to stay in touch. Feel free to reply directly to this email!
              </p>

              <!-- Quote Box -->
              <div style="background:linear-gradient(135deg,rgba(230,36,41,0.1) 0%,rgba(37,99,235,0.08) 100%);border:1px solid rgba(230,36,41,0.3);border-radius:16px;padding:26px;margin-bottom:30px;text-align:center">
                <p style="color:#E62429;font-size:16px;font-style:italic;margin:0 0 8px;line-height:1.7 font-weight:700">
                  "Build. Learn. Improve. Code with passion, deliver with precision."
                </p>
                <p style="color:#64748B;font-size:11px;margin:0;letter-spacing:2px;text-transform:uppercase;font-weight:600">— Shubham Munde</p>
              </div>

              <!-- Tech Arsenal Summary -->
              <div style="background:#111A2E;border:1px solid rgba(37,99,235,0.25);border-radius:16px;padding:24px;margin-bottom:32px">
                <p style="color:#2563EB;font-size:11px;text-transform:uppercase;letter-spacing:3px;margin:0 0 16px;font-weight:800">Core Expertise</p>
                <table style="width:100%;border-collapse:collapse">
                  <tr>
                    <td style="padding:0 8px 8px 0;width:50%">
                      <div style="background:rgba(230,36,41,0.15);border:1px solid rgba(230,36,41,0.3);border-radius:8px;padding:10px 14px">
                        <span style="color:#E62429;font-size:13px;font-weight:700">⚡ Full-Stack MERN</span>
                      </div>
                    </td>
                    <td style="padding:0 0 8px 0;width:50%">
                      <div style="background:rgba(37,99,235,0.15);border:1px solid rgba(37,99,235,0.3);border-radius:8px;padding:10px 14px">
                        <span style="color:#2563EB;font-size:13px;font-weight:700">☕ Java & DSA</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 8px 0 0;width:50%">
                      <div style="background:rgba(230,36,41,0.15);border:1px solid rgba(230,36,41,0.3);border-radius:8px;padding:10px 14px">
                        <span style="color:#E62429;font-size:13px;font-weight:700">🌐 3D WebGL Web</span>
                      </div>
                    </td>
                    <td style="padding:0;width:50%">
                      <div style="background:rgba(37,99,235,0.15);border:1px solid rgba(37,99,235,0.3);border-radius:8px;padding:10px 14px">
                        <span style="color:#2563EB;font-size:13px;font-weight:700">🏆 Hackathon Finalist</span>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Signature -->
              <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:24px">
                <p style="color:#94A3B8;font-size:13px;margin:0 0 4px">Warm regards,</p>
                <p style="margin:0 0 4px">
                  <strong style="color:#E62429;font-size:22px;letter-spacing:1px">Shubham Munde</strong>
                  <span style="color:#2563EB;font-size:16px;margin-left:6px">🕷️</span>
                </p>
                <p style="color:#64748B;font-size:12px;margin:0;letter-spacing:1px">Software Engineer // Full Stack Developer</p>
              </div>

            </div>

            <!-- Footer -->
            <div style="background:#050811;padding:20px 32px;text-align:center;border-top:1px solid rgba(230,36,41,0.2)">
              <p style="color:#64748B;font-size:11px;margin:0;line-height:1.8">
                You received this transmission because you connected via Shubham Munde's Portfolio 🕷️<br/>
                Reply anytime — I read every message personally.
              </p>
            </div>

          </div>
        </body>
        </html>
      `,
    })

    if (existing) {
      existing.thankSent = true
      await existing.save()
    } else {
      await Visitor.create({ name, email, thankSent: true })
    }

    res.status(200).json({ success: true, message: 'Thank you email sent!' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Failed to send email.' })
  }
}

module.exports = { sendContact, thankVisitor }