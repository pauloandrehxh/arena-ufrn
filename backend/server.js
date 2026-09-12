import express from 'express';
import cors from 'cors';
import prisma from './src/lib/prisma.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Servidor rodando http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.json({
        message: 'Arena UFRN API funcionando!'
    });
});

app.get('/api/test', (req, res) => {
    res.json({
        message: 'Comunicação com Backend realizada com Sucesso!'
    });
});

app.get('/api/quadras', async (req, res) => {
    try {
        const quadras = await prisma.quadra.findMany();

        res.json(quadras);
    } catch (error) {
        console.error("Erro ao buscar quadras:", error);

        res.status(500).json({
            message: "Erro ao buscas quadras.",
        });
    }
});

app.get('/api/quadras/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        const quadra = await prisma.quadra.findUnique({
            where: {
                id: id,
            },
        });

        if (!quadra) {
            return res.status(404).json({
                message: "Quadra não encontrada."
            });
        }

        res.json(quadra);
    } catch (error) {
        console.error("Erro ao buscar quadra:", error);

        res.status(500).json({
            message: "Erro ao buscar a quadra.",
        })
    }
})

app.post('/api/quadras', async (req, res) => {
    try {
        const { name } = req.body;

        const quadra = await prisma.quadra.create({
            data: {
                name: name,
            },
        });

        res.status(201).json(quadra);
    } catch (error) {
        console.error("Erro ao criar quadra:", error);

        res.status(500).json({
            message: "Erro ao criar quadra."
        });
    }
})

app.put('/api/quadras/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name } = req.body;

        const quadra = await prisma.quadra.update({
            where: {
                id: id,
            },
            data: {
                name: name,
            },
        });

        res.json(quadra);
    } catch (error) {
        console.error("Erro ao atualizar quadra:", error);

        res.status(500).json({
            message: "Erro ao atualizar quadra.",
        })
    }
})

app.delete('/api/quadras/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        const quadra = await prisma.quadra.delete({
            where: {
                id: id,
            },
        });

        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar quadra:", error);

        res.status(500).json({
            message: "Erro ao deletar quadra.",
        });
    }
})