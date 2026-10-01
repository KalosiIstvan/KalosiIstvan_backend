const express = require("express");
const fs = require("fs/promises");

const app = express();
const PORT = 3000;
const file = "./adatok.json";

app.use(express.json());

async function readData() {
    try {
        const data = await fs.readFile(file, "utf8");
        return JSON.parse(data);
    } catch (error) {
        if (error.code === "ENOENT") {
            return {
                osztalyok: [],
                diakok: []
            };
        }

        return {
            osztalyok: [],
            diakok: []
        };
    }
}

async function writeData(data) {
    await fs.writeFile(
        file,
        JSON.stringify(data, null, 2),
        "utf8"
    );
}

app.get("/osztalyok", async (req, res) => {
    try {
        const data = await readData();
        res.status(200).json(data.osztalyok);
    } catch {
        res.status(500).json({
            error: "Hiba az adatok olvasásakor"
        });
    }
});

app.post("/osztalyok", async (req, res) => {
    try {
        const { nev, szak, evfolyam } = req.body;

        if (!nev || !szak || !evfolyam) {
            return res.status(400).json({
                error: "Hiányzó adatok"
            });
        }

        const data = await readData();

        const newId =
            data.osztalyok.length > 0
                ? Math.max(...data.osztalyok.map(o => o.id)) + 1
                : 1;

        const newOsztaly = {
            id: newId,
            nev,
            szak,
            evfolyam
        };

        data.osztalyok.push(newOsztaly);

        await writeData(data);

        res.status(201).json(newOsztaly);
    } catch {
        res.status(500).json({
            error: "Hiba az adatok írásakor"
        });
    }
});

app.delete("/osztalyok/:id", async (req, res) => {
    try {
        const data = await readData();
        const id = Number(req.params.id);

        const osztaly = data.osztalyok.find(
            o => o.id === id
        );

        if (!osztaly) {
            return res.status(404).json({
                error: "Osztály nem található"
            });
        }

        const vanDiak = data.diakok.some(
            d => d.osztaly_id === id
        );

        if (vanDiak) {
            return res.status(409).json({
                error: "Az osztályhoz még tartoznak diákok"
            });
        }

        data.osztalyok = data.osztalyok.filter(
            o => o.id !== id
        );

        await writeData(data);

        res.status(204).send();
    } catch {
        res.status(500).json({
            error: "Hiba az osztály törlésekor"
        });
    }
});

app.get("/diakok", async (req, res) => {
    try {
        const data = await readData();

        const eredmeny = data.diakok.map(diak => {
            const osztaly = data.osztalyok.find(
                o => o.id === diak.osztaly_id
            );

            return {
                ...diak,
                osztalyNev: osztaly ? osztaly.nev : null
            };
        });

        res.status(200).json(eredmeny);
    } catch {
        res.status(500).json({
            error: "Hiba az adatok olvasásakor"
        });
    }
});

app.post("/diakok", async (req, res) => {
    try {
        const { nev, email, osztaly_id } = req.body;

        if (!nev || !email || !osztaly_id) {
            return res.status(400).json({
                error: "Hiányzó adatok"
            });
        }

        const data = await readData();

        const osztaly = data.osztalyok.find(
            o => o.id === Number(osztaly_id)
        );

        if (!osztaly) {
            return res.status(400).json({
                error: "Az osztály nem létezik"
            });
        }

        const newId =
            data.diakok.length > 0
                ? Math.max(...data.diakok.map(d => d.id)) + 1
                : 1;

        const ujDiak = {
            id: newId,
            nev,
            email,
            osztaly_id: Number(osztaly_id)
        };

        data.diakok.push(ujDiak);

        await writeData(data);

        res.status(201).json(ujDiak);
    } catch {
        res.status(500).json({
            error: "Hiba az adatok írásakor"
        });
    }
});

app.delete("/diakok/:id", async (req, res) => {
    try {
        const data = await readData();
        const id = Number(req.params.id);

        const diak = data.diakok.find(
            d => d.id === id
        );

        if (!diak) {
            return res.status(404).json({
                error: "Diák nem található"
            });
        }

        data.diakok = data.diakok.filter(
            d => d.id !== id
        );

        await writeData(data);

        res.status(204).send();
    } catch {
        res.status(500).json({
            error: "Hiba a diák törlésekor"
        });
    }
});

app.get("/", (req, res) => {
    res.send("Fut a szerver!");
});

app.listen(PORT, () => {
    console.log(`Szerver fut a http://localhost:${PORT} címen`);
});