http://localhost:8080 -> muestra el home

---

Inicio de sesión:

http://localhost:8080/login

Usuario registrado -> adminCoder@coder.com
Contraseña -> adminCod3r123

---

Cerrar Sesion:

http://localhost:8080/profile

Clickear sobre el boton de cerrar sesión

---

---

---

Para consultar los usuarios

Petición GET - Obtener todos los usuarios

http://localhost:8080/api/user - API

---

Peticion POST - Crear usuario

http://localhost:8080/api/user - API

estructura por Postman

{
"first_name": "John",
"last_name": "Doe",
"email": "johndoe@efff.com",
"age": "30",
"password": "secretpassword",
"role": "user"
}

---

Petición GET - obtener usuario por id

http://localhost:8080/api/user/:uid - API

pasar por params en postman el id del usuario

---

Petición PUT - actualizar usuario

http://localhost:8080/api/user/:uid - API

Pasar por params el id y por body la estructura a actualizar

{
"first_name": "John",
"last_name": "Doe",
"email": "johndoe@efff.com",
"age": "30",
"password": "secretpassword",
"role": "user"
}

---

Peticion Post - Para actualizar rol user a premium y viseversa

http://localhost:8080/api/user/premium/:uid

pasar por params el id del usuario y por body, el rol a cambiar (user o premium)
solo se puede realizar el usuario tiene rol admin

---

Peticion Delete - Para eliminar un usuario

http://localhost:8080/api/user/:uid

pasar id del usuario para eliminar

---

Para consultar los productos:

Petición GET - Todos los productos

http://localhost:8080/api/product - API
http://localhost:8080/product - Navegador

---

Petición POST - Guardar producto

http://localhost:8080/api/product

Estructura para enviar en postman

{
"title": "Producto 2",
"description": "Descripcion del producto 2",
"code": "DE5379",
"price": 7000,
"status": true,
"stock": 15,
"category": "Aseo",
"thumbnail": "imagen producto 2"
}

---

Petición PUT - Actualizar Producto

http://localhost:8080/api/product/:id

Pasar id por parametro

Estructura
{
"title": "Producto 2 Modificado",
"description": "Descripcion del producto 2 modificado",
"code": "DE537G",
"price": 6600,
"status": true,
"stock": 45,
"category": "Grano",
"thumbnail": "imagen producto 2 modificado"
}

---

Petición Delete - Eliminar producto

http://localhost:8080/api/product/:id

Pasar id para eliminar.

---

---

---

Para consultar los carritos:

peticion GET - Obtener carritos

http://localhost:8080/api/cart - API
http://localhost:8080/cart - navegador

---

Peticion POST - Guardar producto en carrito

http://localhost:8080/api/cart - API
http://localhost:8080/cart - navegador

Estructura por body - si hay un carrito creado proporcionar el idCart, si quiere un carrito nuevo solo ingresar el producto.

{
"idCart": "64b6acc420ab4253c696d2fb",
"idProduct": "64b5f0ae4cff50135172ff2e",
"quantity": 15
}

---

Peticion Delete - Eliminar producto desde carrito

http://localhost:8080/api/cart/:cid/products/:pid

Se debe pasar el id del carrito y el id del producto.

---

Peticion PUT - Actualizar productos de un carrito

http://localhost:8080/api/cart/:cid

pasar id del carrito por params

Estructura por body - postman:

{
"products": [
{
"product": "64b5f0ae4cff50135172ff30"
},
{
"product": "64b5f0ae4cff50135172ff22"
}
]
}

---

Peticion PUT - Actualizar cantidad de un producto en carrito

http://localhost:8080/api/cart/:cid/products/:pid

Se debe pasar el id del carrito y del producto

ademas pasar por body la estructura:

{
"quantity": 10
}

---

Peticion GET - Obtener carrito y productos del carrito.

http://localhost:8080/api/cart/:cid

Se debe pasar el id del carrito.

Peticion Delete - Vaciar carrito por id

http://localhost:8080/api/cart/:cid

se debe pasar el id del carrito para vaciarlo.

---

---

---

Peticion GET - Obtener chats

http://localhost:8080/api/chat - API
http://localhost:8080/chat - Navegador

---

Enviar un mensaje

http://localhost:8080/api/chat

Estructura por body

{
"user": "facjohan@hotmail.com",
"message": "Muy bien y tu?"
}

---

---

---

Se implemento el token jwt y se agrego la ruta /current para validar el token
Al iniciar sesion se crea el token, y con postman se puede probar al enviar lo siguiente:

Petion POST - primero debe iniciar sesion

http://localhost:8080/api/sessions/login

estructura para enviar por postman

{
"email": "facjohan@hotmail.com",
"password": "Coder1234"
}

---

---

---

Peticion GET

http://localhost:8080/api/sessions/current

y enviar por headers una variable Authorization con value -> Bearer y el token

---

---

---

Peticion POST - Comprar carrito de compras

Enviar por params el id del carrito

http://localhost:8080/api/cart/:cid/purchase

---

---

---

Petición GET - Crear Mocks de productos

http://localhost:8080/mockingproducts

Se creara 500 productos en la base de datos

---

---

---

Peticion Get - Testeo de logger

Abrir por navegador o postman

http://localhost:8080/api/loggerTest

debe crear los registros de acuerdo al logger
