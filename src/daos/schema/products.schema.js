import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productCollection = 'products'


const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        index: true,
        require: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        index: true,
        required: true
    },
    thumbnail: {
        type: String,
        required: false
    },
    owner: {
        type: String,
        default: 'admin'
    }
})

productSchema.plugin(mongoosePaginate)

export const productModel = mongoose.model(productCollection, productSchema)