const express = require('express');
const { read } = require('fs');
const fs = require('fs/promises');

const app = express();
const PORT =  3000;
const file = "./adatok.json";

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Fut a szerver!');
    });

    app.post ('/adatok', (req, res) => {
            
            const adatok = req.body;
            console.log(adatok);
            res.send('Adatok fogadva!');

        });
    app.listen (PORT, () => {
        console.log(`Szerver fut a http://localhost:${PORT} címen`);
    });


