import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const generateResetPasswordToken = (userId) => {
    const token = jwt.sign({ userId }, config.jwt.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

export const verifyToken = (resetToken) => {
    try {
        // Verifica el token usando la clave secreta
        const decodedToken = jwt.verify(resetToken, config.jwt.JWT_SECRET);

        // Si no se ha lanzado ninguna excepción, el token es válido
        return true;
    } catch (error) {
        console.error('Error al verificar el token:', error);
        return false; // Si hay algún error, el token no es válido
    }
}

export const extractToken = (token) => {
    try {
        // Verifica el token usando la clave secreta
        const decodedToken = jwt.verify(token, config.jwt.JWT_SECRET);

        // Si no se ha lanzado ninguna excepción, el token es válido
        return decodedToken.userId;

    } catch (error) {
        console.error('Error al verificar el token:', error);
        return false; // Si hay algún error, el token no es válido
    }
}