import nodemailer from 'nodemailer'

export const transpor = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: "facjohan@gmail.com",
        pass: "gcwjbrexxtgkhcmq",
    },
});