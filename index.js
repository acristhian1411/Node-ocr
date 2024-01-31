const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');

const app = express();
const port = 3000;

app.use(express.static('public'));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), (req, res) => {
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

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
