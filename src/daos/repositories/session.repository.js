import passport from "passport";
import jwt from 'jsonwebtoken';
import config from "../../config/config.js";
import { SaveSessionCurrentDTO } from "../dto/sessionCurrent.dto.js";
import getDAOS from "../daos.factory.js";
import MailingService from "../../services/mailing.js";
import { generateResetPasswordToken, verifyToken, extractToken } from "../../utils/resetPassword.js";

const { usersDAO } = getDAOS();



class SessionsService {

    constructor() {
        this.dao = usersDAO;
    }

    async register(req, res, next) {
        passport.authenticate('register', (err, user, info) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!user) {
                return res.status(400).json({ error: info.message });
            }
            return res.json({ status: "success", message: "User Register" });
        })(req, res, next);
    }

    async login(req, res) {
        passport.authenticate('login', { passReqToCallback: true, session: false, failureRedirect: '/failLogin', failureMessage: true, })(req, res, async () => {
            const serialUser = {
                name: `${req.user.first_name} ${req.user.last_name}`,
                email: req.user.email,
                age: req.user.age,
                role: req.user.role
            }

            const token = jwt.sign(serialUser, config.jwt.JWT_SECRET, { expiresIn: "1h" })

            res.cookie('cookie', token, { maxAge: 360000000 }).send({ status: 'success', message: 'Inicio de sesión exitoso', payload: "OK" });
        });
    }

    async resetPassword(req, res) {
        passport.authenticate('resetPassword', { failureRedirect: '/failResetPassword' })(req, res, () => {
            res.send({ status: "success", message: "Contraseña restaurada" });
        });
    }

    async sendEmailToken(req, res) {
        const { email } = req.body;

        try {
            const user = await this.dao.getUserByEmail(email);

            if (!user) {
                return res.status(200).json({ error: "Usuario no encontrado" });
            }
            const userId = user._id.toString();
            const token = generateResetPasswordToken(userId)

            const mailer = new MailingService()
            await mailer.sendResetPasswordMail({
                resetToken: token,
                to: user.email
            })

            res.status(200).json({ status: "success", message: "Token enviado correctamente" })

        } catch (error) {
            console.error('Error al generar el token:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async verifyToken(req, res) {
        const resetToken = req.query.token;

        // Verificar el token aquí
        const isValidToken = verifyToken(resetToken);  // Implementa esta función

        if (isValidToken) {
            res.render('resetPasswordForm', { token: resetToken });
        } else {
            console.log('Token inválido o expirado')
            res.redirect('/resetPasswordMail')
            /* res.status(400).send('Token inválido o expirado'); */
        }
    }

    /* async resetPasswordToken(req, res) {
        const { token, password } = req.body;
        try {

            const vertoken = verifyToken(token)
            if (vertoken) {
                const idUser = extractToken(token)
                const user = await this.dao.getUserById(idUser);
                if (user) {
                    // Actualizar la contraseña y limpiar el token de reset
                    const newHashedPassword = createHash(password);
                    await this.dao.updateUser(idUser, { password: newHashedPassword, resetToken: null });
                    //por si el resetToken se encuentra dentro del modelo.
                    //await this.dao.updateUser(idUser, { password: newHashedPassword, resetToken: null });

                    res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
                } else {
                    res.status(400).json({ error: 'Usuario no encontrado' });
                }

            } else {
                res.status(400).json({ error: 'Usuario no encontrado' });
            }
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                // El token ha expirado
                res.status(401).json({ error: 'Token ha expirado. Genera un nuevo token.' });
            } else {
                // Otro tipo de error (firma inválida, token malformado, etc.)
                res.status(401).json({ error: 'Token inválido.' });
            }
        }
    } */

    /* async resetPasswordToken(req, res) {
        const { token, password } = req.body;
        try {

            const vertoken = verifyToken(token)
            if (vertoken) {
                const idUser = extractToken(token)
                const user = await this.dao.getUserById(idUser);
                if (user) {
                    // Actualizar la contraseña y limpiar el token de reset
                    const newHashedPassword = createHash(password);
                    await this.dao.updateUser(idUser, { password: newHashedPassword, resetToken: null });
                    //por si el resetToken se encuentra dentro del modelo.
                    //await this.dao.updateUser(idUser, { password: newHashedPassword, resetToken: null });

                    res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
                } else {
                    res.status(400).json({ error: 'Usuario no encontrado' });
                }

            } else {
                res.status(400).json({ error: 'Usuario no encontrado' });
            }
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                // El token ha expirado
                res.status(401).json({ error: 'Token ha expirado. Genera un nuevo token.' });
            } else {
                // Otro tipo de error (firma inválida, token malformado, etc.)
                res.status(401).json({ error: 'Token inválido.' });
            }
        }
    } */

    async current(req, res) {
        try {
            passport.authenticate('current', { session: false })(req, res, () => {
                const sessionPayload = new SaveSessionCurrentDTO(req.user)
                res.json({ payload: sessionPayload });
            });
        } catch (error) {
            console.error('Error al obtener token:', error);
            res.status(404).json({ status: 'error', error: 'Recurso no encontrado' });
        }
    }

    async logout(req, res) {
        try {
            res.clearCookie('cookie');
            return res.status(200).json({ status: 'success', message: 'Sesión cerrada correctamente' });
        } catch (err) {
            console.error('Error al cerrar la sesión:', err);
            res.status(500).json({ status: 'error', error: 'Error al cerrar la sesión' });
        }
    }
}

export default new SessionsService();
