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

function listarBlogs() {
    fetch("https://www.googleapis.com/blogger/v3/users/self/blogs", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener la lista de blogs');
            }
            return response.json();
        })
        .then(data => {
            const blogList = document.createElement('ul');
            data.items.forEach(blog => {
                const listItem = document.createElement('li');
                listItem.textContent = blog.name;
                blogList.appendChild(listItem);
            });
            const divContainer = document.createElement('div'); // Create container element
            divContainer.id = 'blogListContainer'; // Set the id of the container
            document.body.appendChild(divContainer); // Append the container to the body
            const container = document.getElementById('blogListContainer');
            container.appendChild(blogList);
        })
        .catch(error => {
            console.error('Error al obtener la lista de blogs:', error);
        });
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

                data.items.forEach(post => {
                    const fila = document.createElement('tr');
                    const postTitle = document.createElement('td');
                    postTitle.textContent = post.title;
                    fila.appendChild(postTitle);

                    const postDate = document.createElement('td');
                    postDate.textContent = new Date(post.published).toLocaleDateString();
                    fila.appendChild(postDate);

                    const postId = document.createElement('td');
                    const linkEntrada = document.createElement('a');
                    linkEntrada.href = `editar.html?id=${post.id}`;

                    linkEntrada.textContent = post.id;

                    postId.appendChild(linkEntrada);
                    fila.appendChild(postId);

                    taula.appendChild(fila);

                });
                postsDiv.appendChild(taula);
            } else {
                postsDiv.textContent = 'No hay entradas disponibles en este momento.';
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
            form.querySelector('#contingut').value = data.content;
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
            textEnAngles = data;
            document.getElementById('contingutAngles').value = textEnAngles;

        })
        .catch(error => {
            console.error('Error al traducir el texto:', error);
        });
}

function guardarEntrada() {
    // Obtener los valores de los campos del formulario
    const titulo = document.getElementById('titol').value;
    const contenido = document.getElementById('contingut').value;
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