import mailer from 'nodemailer'
import config from '../config/config.js'

/* console.log(config.mailing.PASSWORD)
console.log(config.mailing.SERVICE)
console.log(config.mailing.USER) */

export default class MailingService {

    constructor() {
        this.client = mailer.createTransport({
            service: config.mailing.SERVICE,
            port: 587,
            auth: {
                user: config.mailing.USER,
                pass: config.mailing.PASSWORD
            }
        })
    }

    sendResetPasswordMail = async ({ resetToken, to }) => {
        /*  console.log(to) */
        /* console.log(resetToken) */
        const resetUrl = `${config.app.APP_URL}:${config.mongo.PORT}/api/sessions/verify-token?token=${resetToken}`;
        const html = `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${resetUrl}">Haga Clic para recuperar su contraseña</a>`;

        const result = await this.client.sendMail({
            from: config.mailing.USER,
            to: to,
            subject: 'Restablecimiento de contraseña',
            html,
        });

        return result;
    }
}