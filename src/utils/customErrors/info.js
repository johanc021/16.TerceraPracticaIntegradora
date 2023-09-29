export const generateUserError = (user) => {
    return `Las propiedades no estan completas: 
            el primer nombre ${user.first_name}, 
            el apellido es necesario ${user.last_name},
            el correo es obligatorio ${user.email},
            la edad es requerida ${user.age},
            se requiere un password ${user.password}`
}

export const generateProductError = (product) => {
    return `Las propiedades no estan completas: 
            el primer nombre ${product.title}, 
            el apellido es necesario ${product.description},
            el codigo es obligatorio ${product.code},
            el precio es necesario ${product.price},
            el status es necesario ${product.status},
            el stock es necesario ${product.stock},
            la categoria es necesaria ${product.category},
            la imagen del producto es necesaria ${product.thumbnail}`
}

export const generateCartError = (cart) => {
    console.log(cart)
    /* return `Las propiedades no estan completas: 
            el primer nombre ${product.title}, 
            el apellido es necesario ${product.description},
            el codigo es obligatorio ${product.code},
            el precio es necesario ${product.price},
            el status es necesario ${product.status},
            el stock es necesario ${product.stock},
            la categoria es necesaria ${product.category},
            la imagen del producto es necesaria ${product.thumbnail}` */
}
