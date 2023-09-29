import mongoose from "mongoose";

const userCollection = 'Users'
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: String,
    password: String,
    cart: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'carts'
            }
        ]
    },
    role: {
        type: String,
        enum: ['premium', 'admin', 'user'],
        default: 'user'
    },
    active: {
        type: Boolean,
        required: true,

    },
    full_name: {
        type: String,
        required: true
    }
})
const userModel = mongoose.model(userCollection, userSchema)
export default userModel;