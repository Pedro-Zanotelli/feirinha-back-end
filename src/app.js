import express from "express";
import cors from "cors";

const app = express();
app.use(cors())
app.use(express.json());

const compras = [];
let idAtual = 1;

app.post("/items", (req, res) => {
  const { name, quantity, type } = req.body;

  if (
    !name || typeof name !== "string" ||
    !quantity || typeof quantity !== "number" || !Number.isInteger(quantity) ||
    !type || typeof type !== "string"
  ) {
    return res.status(422).send("Todos os campos são obrigatórios e devem ser válidos.");
  }

  const itemExiste = compras.find(item => item.name.toLowerCase() === name.toLowerCase());
  if (itemExiste) {
    return res.status(409).send("Item com esse nome já existe.");
  }

  const novoItem = {
    id: idAtual++,
    name,
    quantity,
    type
  };

  compras.push(novoItem);
  res.status(201).send(novoItem);
});

app.get("/items", (req, res) => {
  const { type } = req.query;

  if (type) {
    const filtrados = compras.filter(item => item.type === type);
    return res.send(filtrados);
  }


  res.send(compras);
});

app.get("/items/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).send("O ID deve ser um número inteiro positivo.");
  }

  const item = compras.find(item => item.id === id);
  if (!item) {
    return res.status(404).send("Item não encontrado.");
  }

  res.send(item);
});

app.listen(5000, () => {
    console.log("servidor ta rodando");
})
