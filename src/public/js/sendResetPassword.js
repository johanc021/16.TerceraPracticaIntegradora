const forgotPasswordForm = document.getElementById('forgotPasswordForm');

forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;

    // Envia el correo electrónico al servidor
    fetch('/api/sessions/sendEmailResetPassword', {
        method: 'POST',
        body: JSON.stringify({ email }),  // Envia el correo electrónico en un objeto
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            console.log("Correo electrónico enviado exitosamente");
        } else {
            console.error("Error al enviar el correo electrónico");
        }
    });
});