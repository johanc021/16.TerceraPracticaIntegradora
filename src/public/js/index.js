const socket = io()

const messages = document.getElementById("messages")

const mensajes = []

const mostrarMensajes = () => {
    mensajes.forEach(m => {
        let mensaje = document.createElement("p")
        mensaje.innerHTML = `${m.user}: ${m.message}`
        messages.appendChild(mensaje)
    })
}


socket.on("newMessage", data => {
    mensajes.push(data)
    messages.innerHTML = ""
    mostrarMensajes()
})