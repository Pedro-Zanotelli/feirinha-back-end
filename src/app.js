import express from "express";
import cors from "cors";

const app = express();
app.use(cors())
app.use(express.json());

const compras = []; // lista começa vazia
let idAtual = 1;

app.post("/items", (req, res) => {
  const { name, quantity, type } = req.body;

  // validação dos campos obrigatórios
  if (
    !name || typeof name !== "string" ||
    !quantity || typeof quantity !== "number" || !Number.isInteger(quantity) ||
    !type || typeof type !== "string"
  ) {
    return res.status(422).send("Todos os campos são obrigatórios e devem ser válidos.");
  }

  // impedir itens com o mesmo nome (case insensitive)
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
    // Filtra os itens cujo type é exatamente igual ao query 'type' (case sensitive)
    const filtrados = compras.filter(item => item.type === type);
    return res.send(filtrados);
  }

  // Se não enviou query 'type', retorna todos os itens
  res.send(compras);
});

app.listen(5000, () => {
    console.log("servidor ta rodando");
})
