import type  {Express} from "express";
import express from "express";
import {prisma} from "@repo/db";

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post("/user", express.json(), async (req, res) => {
  const { name, email, password } = req.body;
  if(!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }
  const newUser = await prisma.user.create({
    data: { name, email, password },
  });
  res.status(201).json(newUser);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});