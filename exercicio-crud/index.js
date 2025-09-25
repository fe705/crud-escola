const express = require('express');
const cors = require('cors');

const alunosRouter = require('./routes/alunos');
const professoresRouter = require('./routes/professores');

const app = express();
app.use(cors());
app.use(express.json());

// Mapeamento das rotas
app.use('/alunos', alunosRouter);
app.use('/professores', professoresRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});