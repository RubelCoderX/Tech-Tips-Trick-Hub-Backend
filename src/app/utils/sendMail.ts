import nodemailer from 'nodemailer'
import config from '../config'
export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.node_dev === 'production', // Use `true` for port 465, `false` for all other ports
    auth: {
      user: 'mdrubel29879@gmail.com',
      pass: 'pyko weoe ibns ptkr ',
    },
  })
  await transporter.sendMail({
    from: 'mdrubel29879@gmail.com',
    to, // list of receivers
    subject: 'Reset your Password With in 5 mints✔', // Subject line
    text: 'Hello! Tech Trick & Hub?', // plain text body
    html, // html body
  })
}
