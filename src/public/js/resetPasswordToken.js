document.getElementById('resetPasswordForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    // Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    const token = document.querySelector('input[name="token"]').value;
    const data = {
        password,
        token
    };

    try {
        const response = await fetch('/api/sessions/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Contraseña restablecida con éxito.');
        } else {
            alert('Hubo un error al restablecer la contraseña.');
        }
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        alert('Hubo un error al enviar la solicitud.');
    }
});
