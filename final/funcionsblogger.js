function initGoogle() {
    const client = google.accounts.oauth2.initTokenClient({
        client_id: '721881157857-dupjochlg3c4r3scd1bll14cg1a2lf35.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/blogger',
        callback: (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
                console.log(tokenResponse, tokenResponse.access_token);
                localStorage.setItem("token", tokenResponse.access_token);
                window.location.href = "entrades.html";
            }
        },
    });
    client.requestAccessToken();
}

function llegirEntrades() {
    fetch("https://www.googleapis.com/blogger/v3/blogs/7490702723962925532/posts", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las entradas del blog');
            }
            return response.json();
        })
        .then(data => {
            const divEntrades = document.createElement('div');
            divEntrades.id = 'divEntrades';
            document.body.appendChild(divEntrades);

            const postsDiv = document.getElementById('divEntrades');

            if (data.items && data.items.length > 0) {
                taula = document.createElement('table');

                const filaHeader = document.createElement('tr');
                const tdNom = document.createElement('th');
                tdNom.textContent = 'Títol';
                const tdData = document.createElement('th');
                tdData.textContent = 'Data de creació';
                const tdEditar = document.createElement('th');
                tdEditar.textContent = 'Editar';
                const tdEsborrar = document.createElement('th');
                tdEsborrar.textContent = 'Esborrar';
                filaHeader.appendChild(tdNom);
                filaHeader.appendChild(tdData);
                filaHeader.appendChild(tdEditar);
                filaHeader.appendChild(tdEsborrar);
                taula.appendChild(filaHeader);

                data.items.forEach(post => {

                    const fila = document.createElement('tr');
                    fila.className = `entrada`;
                    fila.id = `entrada-${post.id}`;
                    const postTitle = document.createElement('td');
                    postTitle.className = `titol-entrada`;
                    postTitle.textContent = post.title;
                    fila.appendChild(postTitle);

                    const postDate = document.createElement('td');
                    postDate.textContent = new Date(post.published).toLocaleDateString();
                    fila.appendChild(postDate);

                    const postId = document.createElement('td');
                    const linkEntrada = document.createElement('a');
                    linkEntrada.href = `editar.html?id=${post.id} `;

                    linkEntrada.textContent = '🖊️ Editar';

                    postId.appendChild(linkEntrada);
                    fila.appendChild(postId);

                    const tdEsborrar = document.createElement('td');
                    const enllaçEsborrar = document.createElement('a');
                    enllaçEsborrar.href = `#`;
                    enllaçEsborrar.onclick = function () {
                        esborrarEntrada(post.id);
                        return false;  // Prevent the default action
                    };

                    enllaçEsborrar.textContent = '🗑️ Esborrar';

                    tdEsborrar.appendChild(enllaçEsborrar);
                    fila.appendChild(tdEsborrar);

                    taula.appendChild(fila);

                });
                postsDiv.appendChild(taula);
            } else {
                postsDiv.textContent = 'No hi ha entrades.';
            }
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });
}

//Funció que llegirà l'entrada amb l'id corresponent, i mostrarà també la traducció

function leerEntrada(id) {
    fetch(`https://www.googleapis.com/blogger/v3/blogs/7490702723962925532/posts/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener la entrada');
            }
            return response.json();
        })
        .then(data => {
            // Crear el formulario
            const form = document.getElementById('entradaForm');

            // Rellenar el formulario con la información de la entrada
            form.querySelector('#titol').value = data.title;
            form.querySelector('#contingutAngles').value = data.content;
            form.querySelector('#contingut').value = tradueix('en', 'ca', data.content);
            form.querySelector('#data').value = new Date(data.published).toLocaleDateString();
            form.querySelector('#id').value = data.id;
        })
        .catch(error => {
            console.error('Error fetching post:', error);
        });
}

function tradueix(languageFrom, languageTo, text) {

    const requestData = {
        languageFrom: languageFrom,
        languageTo: languageTo,
        text: text
    };

    // Realizar la solicitud POST a la API
    fetch('https://theteacher.codiblau.com/public/google/translate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => {

            if (!response.ok) {
                throw new Error('Error al realizar la solicitud de traducción');
            }

            return response.text();
        })
        .then(data => {

            // Aquí puedes hacer lo que quieras con la respuesta JSON
            if (languageFrom == 'ca') {
                textEnAngles = data;
                document.getElementById('contingutAngles').value = textEnAngles;
            } else {
                textEnCatala = data;

                document.getElementById('contingut').value = textEnCatala;
            }

        })
        .catch(error => {
            console.error('Error al traducir el texto:', error);
        });
}

function guardarEntrada() {
    // Obtener los valores de los campos del formulario
    const titulo = document.getElementById('titol').value;
    const contenido = document.getElementById('contingutAngles').value;
    const id = document.getElementById('id').value;

    // Objeto con los datos de la entrada a actualizar
    const datosEntrada = {
        title: titulo,
        content: contenido
    };

    // Enviar una solicitud PUT para actualizar la entrada en el blog
    fetch(`https://www.googleapis.com/blogger/v3/blogs/7490702723962925532/posts/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosEntrada)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al guardar los cambios en la entrada');
            }
            return response.json();
        })
        .then(data => {
            console.log('Entrada actualizada:', data);
            console.log(tradueix('ca', 'en', contenido));
            alert('L\'entrada ha estat desada correctament.')
            // Aquí puedes realizar cualquier acción adicional después de guardar la entrada, como redirigir a otra página
        })
        .catch(error => {
            console.error('Error al guardar la entrada:', error);
        });
}

function crearNovaEntrada() {
    const title = document.getElementById('titol').value;
    const content = document.getElementById('contingutAngles').value;

    fetch(`https://www.googleapis.com/blogger/v3/blogs/7490702723962925532/posts`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            kind: "blogger#post",
            title: title,
            content: content
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al crear la entrada');
            }
            return response.json();
        })
        .then(data => {
            alert('Entrada creada');
            window.location.href = 'entrades.html'; // Redirigim a la pàgina d'entrades
        })
        .catch(error => {
            console.error('Error al crear l\'entrada:', error);
            alert('Error al crear l\'entrada. Torna-ho a provar');
        });
}

function esborrarEntrada(postId) {
    // URL of your API endpoint for deleting a post
    const url = `https://www.googleapis.com/blogger/v3/blogs/7490702723962925532/posts/${postId}`;

    // Options for the fetch request
    const options = {
        method: 'DELETE', // HTTP method to delete the post
        headers: {
            'Content-Type': 'application/json', // Headers for the request
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    };

    // Perform the fetch request
    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text; // Parse the JSON response
        })
        .then(data => {
            console.log('Post deleted successfully:', data); // Log success message
            // Optionally, you can update the UI to reflect the deleted post
            // For example, you might remove the post element from the DOM
            document.getElementById(`entrada-${postId}`).remove();
            alert("Entrada esborrada correctament");
            window.location.href = "entrades.html";
        })
        .catch(error => {
            console.error('There was a problem with the delete request:', error); // Log error message
        });
}

// Function to filter blog posts
function filtrarEntrades() {
    const filterValue = document.getElementById('filtreInput').value.toLowerCase();
    const posts = document.querySelectorAll('.entrada');

    posts.forEach(post => {
        const title = post.querySelector('.titol-entrada').textContent.toLowerCase();

        if (title.includes(filterValue)) {
            post.style.display = '';
        } else {
            post.style.display = 'none';
        }
    });
}

// Attach event listener to input field
document.getElementById('filtreInput').addEventListener('input', filtrarEntrades);
