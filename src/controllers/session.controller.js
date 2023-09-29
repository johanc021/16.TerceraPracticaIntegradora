import SessionsRepository from '../daos/repositories/session.repository.js';

class SessionsController {
    async register(req, res, next) {
        await SessionsRepository.register(req, res, next);
    }

    async login(req, res) {
        await SessionsRepository.login(req, res);
    }

    async resetPassword(req, res) {
        await SessionsRepository.resetPassword(req, res);
    }

    /*  async resetPasswordToken(req, res) {
         const { token, password } = req.body;
         if (!token || !password) {
             res.status(401).send({ message: "Missing parameters" })
         }
         await SessionsRepository.resetPasswordToken(req, res)
         try {
 
             const vertoken = verifyToken(token)
             if (vertoken) {
                 const extractT = extractToken(token)
                 const user = await UserModel.findOne({ email: extractT });
             }
             // Encuentra al usuario en la base de datos usando el ID del usuario
             const user = await userModel.findById(userId);
 
             if (user) {
                 // Actualiza la contraseña y limpia el token de reset
                 const newHashedPassword = createHash(password);
                 await userModel.updateOne({ _id: user._id }, { password: newHashedPassword, resetToken: null });
 
                 res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
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

    /* async resetPasswordTokend(req, res) {
        const { token, password } = req.body

        const vertoken = verifyToken(token)
        if (vertoken) {

        }
    } */

    async sendEmailToken(req, res) {
        await SessionsRepository.sendEmailToken(req, res)
        /* const { email } = req.body
        console.log(email) */

    }

    async verifyToken(req, res) {
        await SessionsRepository.verifyToken(req, res)
    }

    async logout(req, res) {
        await SessionsRepository.logout(req, res);
    }

    async current(req, res) {
        await SessionsRepository.current(req, res);
    }
}

export default new SessionsController();
