const Section = require('../schema/SectionSchema');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
// Ruta POST para crear una nueva sección
router.post('/celdas', async (req, res) => {
    try {
        const lastSection = await Section.incrementNumber();
        const section = new Section(
            {
                number: lastSection,
                status: req.body.status || 'disponible',
                plate: req.body.plate || '',
                dateEntry: req.body.dateEntry || Date.now(),
                dateExit: req.body.dateExit || Date.now(),
                pin: req.body.pin || ''
            }

        );
        const savedSection = await section.save();
        res.status(201).send(savedSection);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// Ruta GET para obtener todas las secciones
router.get('/celdas', async (req, res) => {
    try {
        const sections = await Section.find({});
        res.status(200).send(sections);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});
//GET /celdas/{id} # Recuperar una celda específica
router.get('/celdas/:id', async (req, res) => {
    try {
        const section = await Section.findById(req.params.id);
        if (!section) {
            return res.status(404).send({ error: 'Section not found' });
        }
        res.status(200).send(section);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});
//GET /celdas/{status} # Recuperar una lista de todas las celdas con estado disponible.
router.get('/celdas/:status', async (req, res) => {
    try {
        const sections = await Section.find({ status: req.params.status });
        res.status(200).send(sections);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});
//PUT /celdas/{id} # Actualizar una celda específica
router.put('/celdas/:id', async (req, res) => {
    try {
        const section = await Section.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!section) {
            return res.status(404).send({ error: 'Section not found' });
        }
        res.status(200).send(section);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}
);
//DELETE /celdas/{id} # Eliminar una celda específica
router.delete('/celdas/:id', async (req, res) => {
    try {
        const section = await Section.findByIdAndDelete(req.params.id);
        if (!section) {
            return res.status(404).send({ error: 'Section not found' });
        }
        res.status(200).send(section);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// //parquear
// router.put('/parquear/:id', async (req, res) => {
//     try {
//         const { plate } = req.body
//         await Section.findByIdAndUpdate({ _id: req.params.id }, { plate: plate })
//         const concatenacion = `${Section.number}${Section.plate}`;
//         Section.pin = await bcrypt.hash(concatenacion, 10)
//         res.json(concatenacion)
//     } catch (err) {
//         res.status(400).send({ error: err.message });
//     }
// })

router.put('/parquear/:id', async (req, res) => {
    try {
        const { plate } = req.body;

        // Encuentra y actualiza la sección con la placa
        const section = await Section.findOneAndUpdate(
            { _id: req.params.id },
            { plate: plate, status: 'no disponible', dateEntry: Date.now() },
            { new: true } // Para que `section` contenga el documento actualizado
        );

        if (!section) {
            return res.status(404).json({ message: 'Sección no encontrada' });
        }

        // Concatenar el número de celda y la placa
        const concatenacion = `${section.number}${section.plate}`;

        // Encriptar la concatenación
        section.pin = await bcrypt.hash(concatenacion, 10);

        // Guardar el documento actualizado
        await section.save();

        res.json({ pin: section.pin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al parquear el vehículo' });
    }
});

router.put('/salir/:id', async (req, res) => {
    try {
        // const { status, plate, dateEntry, dateExit, pin } = req.body;
        const section = await Section.findOneAndUpdate(
            { _id: req.params.id },
            { status: "disponible", plate: "", dateEntry: "", dateExit: "", pin: "" },
            { new: true }
        );
        if (!section) {
            return res.status(404).send({ error: 'Section not found' });
        }
        await section.save();
        res.status(200).send(section);

    } catch (error) {
        res.status(400).send({ error: err.message });
    }
})

module.exports = router;
