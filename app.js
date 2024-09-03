document.addEventListener('DOMContentLoaded', () => {
    let tareaIdActual = null; // Para almacenar el ID de la tarea que se está editando

    // Función para cargar las tareas
    const cargarTareas = () => {
        fetch('http://localhost:3000/api/tareas')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener las tareas');
                }
                return response.json();
            })
            .then(tareas => {
                const listaTareas = document.getElementById('lista-tareas');
                listaTareas.innerHTML = ''; // Limpiar cualquier contenido previo

                tareas.forEach(tarea => {
                    const tareaElemento = document.createElement('li');
                    tareaElemento.textContent = `${tarea.titulo} - ${tarea.descripcion} - ${tarea.completada ? 'Completada' : 'No Completada'}`;

                    // Botón de editar para cada tarea
                    const botonEditar = document.createElement('button');
                    botonEditar.textContent = 'Editar';
                    botonEditar.addEventListener('click', () => {
                        document.getElementById('titulo').value = tarea.titulo;
                        document.getElementById('descripcion').value = tarea.descripcion;
                        document.getElementById('completada').checked = tarea.completada;
                        tareaIdActual = tarea.id;

                        document.getElementById('actualizar-tarea').style.display = 'inline';
                        document.querySelector('button[type="submit"]').style.display = 'none';
                    });

                    tareaElemento.appendChild(botonEditar);
                    listaTareas.appendChild(tareaElemento);
                });
            })
            .catch(error => {
                console.error('Error al cargar las tareas:', error);
            });
    };

    // Cargar las tareas cuando la página se carga
    cargarTareas();

    // Manejar el envío del formulario para crear una nueva tarea
    const formTarea = document.getElementById('form-tarea');
    formTarea.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        const titulo = document.getElementById('titulo').value;
        const descripcion = document.getElementById('descripcion').value;
        const completada = document.getElementById('completada').checked;

        fetch('http://localhost:3000/api/tareas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo,
                descripcion,
                completada
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al crear la tarea');
            }
            return response.json();
        })
        .then(() => {
            // Limpiar el formulario y recargar las tareas
            formTarea.reset();
            cargarTareas();
        })
        .catch(error => {
            console.error('Error al crear la tarea:', error);
        });
    });

    // Manejar la actualización de la tarea
    const botonActualizarTarea = document.getElementById('actualizar-tarea');
    botonActualizarTarea.addEventListener('click', () => {
        const titulo = document.getElementById('titulo').value;
        const descripcion = document.getElementById('descripcion').value;
        const completada = document.getElementById('completada').checked;

        if (tareaIdActual) {
            fetch(`http://localhost:3000/api/tareas/${tareaIdActual}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    titulo,
                    descripcion,
                    completada
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al actualizar la tarea');
                }
                return response.json();
            })
            .then(() => {
                // Limpiar el formulario y recargar las tareas
                formTarea.reset();
                tareaIdActual = null;
                botonActualizarTarea.style.display = 'none';
                document.querySelector('button[type="submit"]').style.display = 'inline';
                cargarTareas();
            })
            .catch(error => {
                console.error('Error al actualizar la tarea:', error);
            });
        }
    });
});
