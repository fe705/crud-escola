const express = require('express');
const router = express.Router();

// Dados em memória com 2 registros de exemplo
let nextId = 3;
const alunos = [
  { id: 1, nome: "Ana Silva", email: "ana.silva@example.com", cpf: "12345678901", telefone: "61999990001", dataNascimento: "1998-05-12" },
  { id: 2, nome: "João Pereira", email: "joao.pereira@example.com", cpf: "98765432100", telefone: "61999990002", dataNascimento: "2000-10-20" }
];

// Validação básica de campos
function validarAluno(data) {
  const { nome, email, cpf, telefone, dataNascimento } = data;
  const faltando = [];
  if (!nome) faltando.push('nome');
  if (!email) faltando.push('email');
  if (!cpf) faltando.push('cpf');
  if (!telefone) faltando.push('telefone');
  if (!dataNascimento) faltando.push('dataNascimento');
  return faltando;
}

// GET /alunos - listar todos
router.get('/', (req, res) => {
  res.json(alunos);
});

// GET /alunos/:id - por id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const aluno = alunos.find(a => a.id === id);
  if (!aluno) return res.status(404).json({ message: 'Aluno não encontrado' });
  res.json(aluno);
});

// POST /alunos - criar
router.post('/', (req, res) => {
  const faltando = validarAluno(req.body);
  if (faltando.length) {
    return res.status(400).json({ message: 'Campos obrigatórios faltando', faltando });
  }

  const { nome, email, cpf, telefone, dataNascimento } = req.body;

  // checar duplicatas por cpf e email
  if (alunos.some(a => a.cpf === cpf)) {
    return res.status(400).json({ message: 'CPF já cadastrado' });
  }
  if (alunos.some(a => a.email === email)) {
    return res.status(400).json({ message: 'Email já cadastrado' });
  }

  const novoAluno = { id: nextId++, nome, email, cpf, telefone, dataNascimento };
  alunos.push(novoAluno);
  res.status(201).json(novoAluno);
});

// PUT /alunos/:id - atualizar
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = alunos.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).json({ message: 'Aluno não encontrado' });

  const faltando = validarAluno(req.body);
  if (faltando.length) {
    return res.status(400).json({ message: 'Campos obrigatórios faltando', faltando });
  }

  const { nome, email, cpf, telefone, dataNascimento } = req.body;

  // checar duplicatas (exceto o próprio registro)
  if (alunos.some(a => a.cpf === cpf && a.id !== id)) {
    return res.status(400).json({ message: 'CPF já cadastrado por outro aluno' });
  }
  if (alunos.some(a => a.email === email && a.id !== id)) {
    return res.status(400).json({ message: 'Email já cadastrado por outro aluno' });
  }

  alunos[index] = { id, nome, email, cpf, telefone, dataNascimento };
  res.json(alunos[index]);
});

// DELETE /alunos/:id - deletar
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = alunos.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).json({ message: 'Aluno não encontrado' });

  const removido = alunos.splice(index, 1)[0];
  res.json({ message: 'Aluno removido', aluno: removido });
});

module.exports = router;