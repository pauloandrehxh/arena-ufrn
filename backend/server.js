import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());

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

app.get('/api/quadras', (req, res) => {
    res.json([
        {
            id: 1,
            name: 'Quadra de Areia 1',
            description: 'Quadra para jogos de volei e futvolei. Atualmente funcionando.'
        },
        {
            id: 2,
            name: 'Quadra de Areia 2',
            description: 'Quadra secundária. Atualmente em construção.'
        }
    ]);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando http://localhost:${PORT}`);
});
