const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

// router.get("/", (req, res) => {
//   res.json({ hello: "world" });
// });

router.get("/", async (req, res) => {
  const user = await User.find();
  if (res) {
    res.json({ user: user });
  } else {
    res.status(404).end();
  }
});

router.get("/:id", async (req, res) => {
  const userId = req.params.id;

  const user = await User.findOne({ _id: userId });
  if (user) {
    res.json({ user: user });
  } else {
    res.status(404).end();
  }
});

router.post("/", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const userName = req.body.userName;
  const password = req.body.password;

  const user = await User.create({
    name: name,
    email: email,
    userName: userName,
    password: password,
  });
  if (user) {
    res.json({ user: user });
  } else {
    res.status(404).end();
  }
});

router.put("/:id", async (req, res) => {
  const userId = req.params.id;
  const name = req.body.name;
  const email = req.body.email;
  const userName = req.body.userName;
  const password = req.body.password;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { name, email, userName, password },
      { new: true }
    );

    if (updatedUser) {
      res.json({ user: updatedUser });
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (err) {
    console.error("Error al actualizar el usuario:", err);
    (404).end();
  }
});

router.delete("/:id", async (req, res) => {
  const userId = req.params.id;
  const user = await User.findOneAndDelete({ _id: userId });
  if (user) {
    res.json({ user: user });
  } else {
    res.status(404).end();
  }
});

router.post("/auth", async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res
      .status(400)
      .json({ error: "El nombre de usuario y la contraseña son obligatorios" });
  }

  try {
    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.status(200).json({ message: "Autenticación exitosa", user });
  } catch (err) {
    console.error("Error durante la autenticación:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
