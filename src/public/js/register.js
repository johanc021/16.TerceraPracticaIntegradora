const form = document.getElementById('registerForm')

form.addEventListener('submit', e => {
    e.preventDefault();

    const data = new FormData(form);
    const obj = {}
    data.forEach((value, key) => obj[key] = value.trim());

    fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => result.json())
        .then(json => {
            // Verificar si el registro fue exitoso antes de redirigir
            if (json.status === "success") {
                // Redirigir al usuario a la página de inicio de sesión
                console.log(json)
                window.location.replace('/login');
            } else {
                console.log(json);
            }
        })
        .catch(error => console.error(error));
});