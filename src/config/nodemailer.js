import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.HOST_MAILTRAP,
  port: process.env.PORT_MAILTRAP,
  auth: {
    user: process.env.USER_MAILTRAP,
    pass: process.env.PASS_MAILTRAP
  }
})
const sendMailToUser = (userMail, token, password) => {
  const mailOptions = {
    from: process.env.USER_MAILTRAP,
    to: userMail,
    subject: 'Bienvenido a la plataforma, confirma tu cuenta 💻',
    html: `<p>Hola, haz clic <a href='${process.env.URL_BACKEND}/user/confirmar/${encodeURIComponent(token)}'>aquí</a> para confirmar tu cuenta.</p>
    ${password ? `<p>Tu contraseña temporal es: <strong>${password}</strong></p>` : ''}`
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Correo enviado: ' + info.response)
    }
  })
}

export {
  sendMailToUser
}
