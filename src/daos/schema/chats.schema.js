import mongoose from "mongoose";

const chatsCollection = 'chats'


const chatsSchema = mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

export const chatsModel = mongoose.model(chatsCollection, chatsSchema)