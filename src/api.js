const serverless = require('serverless-http');
const express = require('express');
const app = express();

app.use(express.json());

app.post('/upload', (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se ha seleccionado ningún archivo.');
    }

    const imageBuffer = req.file.buffer;

    Tesseract.recognize(
        imageBuffer,
        'spa',
        { logger: info => console.log(info) }
    ).then(({ data: { text } }) => {
        res.send(text);
    }).catch(err => {
        console.error(err);
        res.status(500).send('Error al procesar la imagen.');
    });
});

app.use(`/.netlify/functions/api`, router);

module.exports = app

module.exports.handler = serverless(app);