import { MongoManager } from '../db/mongo.manager.js'
import userModel from '../schema/users.schema.js';

export class UsersMongoDAO {
    constructor() {
        MongoManager.start()
    }

    getAll = async () => {
        try {
            let users = await userModel.find();
            return users
        } catch (error) {
            throw new Error('Error al obtener la lista de usuarios');
        }
    }

    saveUser = async (user) => {
        // Verificar si el email ya existe en la base de datos
        const existingUser = await userModel.findOne({ email: user.email });

        if (existingUser) {
            throw new Error('El email ya existe en la base de datos');
        }

        // Si el email no existe, guardar el usuario en la base de datos
        let result = await userModel.create(user);
        return result;
    }

    getUserById = async (param) => {
        try {
            let result = await userModel.findById(param);
            return result;
        } catch (error) {
            throw new Error('Error al obtener el usuario por ID');
        }
    }

    updateUser = async (id, user) => {
        try {
            delete user._id;
            let result = await userModel.updateOne({ _id: id }, { $set: user });
            return result;
        } catch (error) {
            throw new Error('Error al actualizar el usuario');
        }
    }
    /* getIdUserByEmail = async (email) => {
        try {
            let result = await userModel.findOne({ email: email }).select('_id');
            return result;
        } catch (error) {
            throw new Error('Error al obtener el id del usuario por Email');
        }
    } */

    getUserByEmail = async (email) => {
        try {
            let result = await userModel.findOne({ email: email }).select('_id email')
            return result
        } catch (error) {
            throw new Error('Error al obtener el usuario por Email');
        }
    }

    removeUser = async (userId) => {
        try {
            const result = await userModel.findByIdAndRemove(userId);
            if (!result) {
                throw new Error('El usuario no existe');
            }
            return userId;
        } catch (error) {
            throw new Error('Error al eliminar el usuario');
        }
    }
}
