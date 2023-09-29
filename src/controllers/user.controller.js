import { UserRepository } from '../daos/repositories/user.repository.js';
import { STATUS } from '../utils/constantes.js'
import CustomError from '../utils/customErrors/customError.js';
import { generateUserError } from '../utils/customErrors/info.js'
import Error from '../utils/customErrors/enum.js';
import { createResponse, handleRequestError, logRequestDebug, logRequestError, logRequestInfo } from '../utils/winston/logger.js';


const userRepository = new UserRepository()



class userController {
    constructor() {
        this.getAllUsers = this.getAllUsers.bind(this);
        this.createUser = this.createUser.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.getUserByEmail = this.getUserByEmail.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    async getAllUsers(req, res) {
        try {
            logRequestInfo(req);
            const users = await userRepository.getAllUsers();
            if (!users || !users.length === 0) {
                logRequestDebug(req, { error: "No se encontraron registros o los parametros no es correcto" });
                return handleRequestError(res, 404, { message: "No se encontraron registros o los parametros no es correcto" });
            }
            createResponse(res, 200, { users });
            /* res.status(200).json({ users, status: STATUS.SUCCESS }); */
        } catch (error) {
            logRequestError(req, error);
            handleRequestError(res, 500, error);
            /* res.status(500).json({ error: error.message, status: STATUS.FAIL }); */
        }
    }

    async createUser(req, res) {
        try {
            const data = req.body;
            if (!data.first_name || !data.last_name || !data.email || !data.age || !data.password) {
                CustomError.createError({
                    name: "Error al crear el usuario",
                    cause: generateUserError(data),
                    message: "Error al crear el usuario",
                    code: Error.INVALID_TYPE_ERROR
                })
            }
            logRequestInfo(req)
            const result = await userRepository.createUser(data);
            res.status(201).json({ user: result, status: STATUS.SUCCESS });
        } catch (error) {
            logRequestError(req, error);
            handleRequestError(res, 500, error);
            /*  res.status(500).json({ error: error.message, code: error.code, cause: error.cause, status: STATUS.FAIL }); */
        }
    }

    async getUserById(req, res) {
        try {
            const userId = req.params.uid;
            if (!userId) {
                return handleRequestError(res, 404, { message: "Parametro incorrecto" + userId });
            }
            const user = await userRepository.getUserById(userId);
            logRequestInfo(req)
            res.status(200).json({ user, status: STATUS.SUCCESS });
        } catch (error) {
            logRequestError(req, error);
            handleRequestError(res, 400, error);
            /* res.status(400).json({ error: error.message, status: STATUS.FAIL }); */
        }
    }

    async updateUser(req, res) {
        try {
            const userId = req.params.uid;
            const updatedUserData = req.body;
            if (!userId || !updatedUserData) {
                return handleRequestError(res, 404, { message: "Parametro incorrecto" + userId });
            }
            const result = await userRepository.updateUser(userId, updatedUserData);
            logRequestInfo(req)
            res.status(200).json({ result, status: STATUS.SUCCESS });
        } catch (error) {
            logRequestError(req, error);
            handleRequestError(res, 400, error);
            /* res.status(400).json({ error: error.message, status: STATUS.FAIL }); */
        }
    }
    async getUserByEmail(req, res) {
        try {
            const emailUser = req.params.emailUser
            const result = await userRepository.getUserByEmail(emailUser)
            logRequestInfo(req)
            res.status(200).json({ result, status: STATUS.SUCCESS })
        } catch (error) {
            logRequestError(req, error);
            handleRequestError(res, 400, error);
            /* res.status(400).json({ error: error.message, status: STATUS.FAIL }); */
        }
    }

    async changeRole(req, res) {
        try {
            const { uid } = req.params
            const { role } = req.body;
            const user = await userRepository.getUserById(uid)
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            if (req.user && req.user.role === 'admin') {
                // Cambiar el rol del usuario
                user.role = role;

                // Actualizar rol del usuario
                await userRepository.updateUser(user._id.toString(), user)

                logRequestInfo(req);
                return res.status(200).json({ message: 'Rol de usuario cambiado con éxito' });
            } else {
                // Si el usuario no es admin, no está autorizado para cambiar el rol
                return res.status(403).json({ error: 'Acceso no autorizado' });
            }
        } catch (error) {
            logRequestError(req, error);
            handleRequestError(res, 400, error);
            /* res.status(400).json({ error: error.message, status: STATUS.FAIL }); */
        }


    }

    async deleteUser(req, res) {
        const userId = req.params.uid;
        try {
            const result = await userRepository.deleteUser(userId);
            logRequestError(req)
            res.status(200).json({ result, status: STATUS.SUCCESS });
        } catch (error) {
            logRequestError(req, error);
            handleRequestError(res, 400, error);
            /* res.status(400).json({ error: error.message, status: STATUS.FAIL }); */
        }
    }
}

export default new userController()