const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gestortareas'
});
connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos MySQL.');
});

// Ruta para obtener las tareas
app.get('/api/tareas', (req, res) => {
    const query = 'SELECT * FROM tareas';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener las tareas:', err);
            res.status(500).send('Error al obtener las tareas');
            return;
        }
        res.json(results);
    });
});

// Ruta para crear una nueva tarea
app.post('/api/tareas', (req, res) => {
    const { titulo, descripcion, completada } = req.body;
    const query = 'INSERT INTO tareas (titulo, descripcion, completada) VALUES (?, ?, ?)';
    connection.query(query, [titulo, descripcion, completada], (err, results) => {
        if (err) {
            console.error('Error al crear la tarea:', err);
            res.status(500).send('Error al crear la tarea');
            return;
        }
        res.status(201).json({ id: results.insertId, titulo, descripcion, completada });
    });
});

// Ruta para actualizar una tarea existente
app.put('/api/tareas/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, completada } = req.body;
    const query = 'UPDATE tareas SET titulo = ?, descripcion = ?, completada = ? WHERE id = ?';
    connection.query(query, [titulo, descripcion, completada, id], (err) => {
        if (err) {
            console.error('Error al actualizar la tarea:', err);
            res.status(500).send('Error al actualizar la tarea');
            return;
        }
        res.status(200).json({ id, titulo, descripcion, completada });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});