
/* const express = require('express');
const path = require('path');
const cors=require('cors') */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Crea un equivalente de __dirname
const __filename = fileURLToPath(import.meta.url); // Obtén la ruta completa del archivo actual
const __dirname = path.dirname(__filename);       // Obtén el directorio actual

// Configura la carpeta estática
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

