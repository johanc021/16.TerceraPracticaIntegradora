// Obtener el botón de logout por su ID
const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', () => {

    fetch('/api/sessions/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        if (response.status === 200) {
            window.location.replace('/login');
        } else {
            console.error('Error al cerrar sesión');
        }
    }).catch((error) => {
        console.error('Error al realizar la solicitud:', error);
    });
});