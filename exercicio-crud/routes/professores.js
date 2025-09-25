const express = require('express');
const router = express.Router();

// Dados em memória com 2 registros de exemplo
let nextId = 3;
const professores = [
  { id: 1, nome: "Marcos Lima", email: "marcos.lima@example.com", cpf: "11122233344", curso: "Sistemas", disciplina: "Programação" },
  { id: 2, nome: "Patrícia Souza", email: "patricia.souza@example.com", cpf: "55566677788", curso: "Engenharia", disciplina: "Cálculo" }
];

// Validação básica
function validarProfessor(data) {
  const { nome, email, cpf, curso, disciplina } = data;
  const faltando = [];
  if (!nome) faltando.push('nome');
  if (!email) faltando.push('email');
  if (!cpf) faltando.push('cpf');
  if (!curso) faltando.push('curso');
  if (!disciplina) faltando.push('disciplina');
  return faltando;
}

// GET /professores
router.get('/', (req, res) => {
  res.json(professores);
});

// GET /professores/:id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const prof = professores.find(p => p.id === id);
  if (!prof) return res.status(404).json({ message: 'Professor não encontrado' });
  res.json(prof);
});

// POST /professores
router.post('/', (req, res) => {
  const faltando = validarProfessor(req.body);
  if (faltando.length) {
    return res.status(400).json({ message: 'Campos obrigatórios faltando', faltando });
  }

  const { nome, email, cpf, curso, disciplina } = req.body;

  // checar duplicatas por cpf e email
  if (professores.some(p => p.cpf === cpf)) {
    return res.status(400).json({ message: 'CPF já cadastrado' });
  }
  if (professores.some(p => p.email === email)) {
    return res.status(400).json({ message: 'Email já cadastrado' });
  }

  const novoProf = { id: nextId++, nome, email, cpf, curso, disciplina };
  professores.push(novoProf);
  res.status(201).json(novoProf);
});

// PUT /professores/:id
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = professores.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: 'Professor não encontrado' });

  const faltando = validarProfessor(req.body);
  if (faltando.length) {
    return res.status(400).json({ message: 'Campos obrigatórios faltando', faltando });
  }

  const { nome, email, cpf, curso, disciplina } = req.body;

  // checar duplicatas (exceto o próprio registro)
  if (professores.some(p => p.cpf === cpf && p.id !== id)) {
    return res.status(400).json({ message: 'CPF já cadastrado por outro professor' });
  }
  if (professores.some(p => p.email === email && p.id !== id)) {
    return res.status(400).json({ message: 'Email já cadastrado por outro professor' });
  }

  professores[index] = { id, nome, email, cpf, curso, disciplina };
  res.json(professores[index]);
});

// DELETE /professores/:id
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = professores.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: 'Professor não encontrado' });

  const removido = professores.splice(index, 1)[0];
  res.json({ message: 'Professor removido', professor: removido });
});

module.exports = router;