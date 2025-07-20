if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const connectDb = require("./config/connectDb");
const User = require("./models/user");
const Product = require("./models/product");

const app = express();
app.use(cors());

app.use(express.json());

connectDb()
  .then(() => {
    console.log("Base de datos conectada, iniciando servidor...");
    app.listen(process.env.PORT, () => {
      console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error al conectar a la base de datos:", err);
    process.exit(1); // Detén el proceso si la conexión falla
  });

//users routes
app.get("/", (req, res) => {
  res.json({ hello: "world" });
});

app.get("/users", async (req, res) => {
  const user = await User.find();
  if (res) {
    res.json({ user: user });
  } else {
    res.status(404).end();
  }
});

app.get("/user/:id", async (req, res) => {
  const customId = Number(req.params.id);

  const user = await User.findOne({ customId: customId });
  if (user) {
    res.json({ user: user });
  } else {
    res.status(404).end();
  }
});

app.post("/user", async (req, res) => {
  const customId = Number(req.body.id);
  const name = req.body.name;
  const email = req.body.email;
  const userName = req.body.userName;
  const password = req.body.password;

  const user = await User.create({
    customId: customId,
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

app.put("/user/:id", async (req, res) => {
  const customId = Number(req.params.id);
  const name = req.body.name;
  const email = req.body.email;
  const userName = req.body.userName;
  const password = req.body.password;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { customId },
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

app.delete("/user/:id", async (req, res) => {
  const customId = Number(req.params.id);
  const user = await User.findOneAndDelete({ customId });
  if (user) {
    res.json({ user: user });
  } else {
    res.status(404).end();
  }
});

app.post("/auth", async (req, res) => {
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

    if (user.password !== password) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.status(200).json({ message: "Autenticación exitosa", user });
  } catch (err) {
    console.error("Error durante la autenticación:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//products routes

// Crear producto
app.post("/product", async (req, res) => {
  const { customId, name, description, price, available } = req.body;
  try {
    const product = await Product.create({
      customId,
      name,
      description,
      price,
      available,
    });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ error: "Error al crear el producto" });
  }
});

// Consultar todos los productos
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json({ products });
});

// Consultar producto por customId
app.get("/products/:id", async (req, res) => {
  const customId = Number(req.params.id);
  const product = await Product.findOne({ customId });
  if (product) {
    res.json({ product });
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

// Actualizar producto
app.put("/product/:id", async (req, res) => {
  const customId = Number(req.params.id);
  const { name, description, price, available } = req.body;
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { customId },
      { name, description, price, available },
      { new: true }
    );
    if (updatedProduct) {
      res.json({ product: updatedProduct });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

// Eliminar producto
app.delete("/product/:id", async (req, res) => {
  const customId = Number(req.params.id);
  const product = await Product.findOneAndDelete({ customId });
  if (product) {
    res.json({ product });
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

app.listen(process.env.PORT);
