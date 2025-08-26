const express = require("express");
const router = express.Router();
const Product = require("../models/product");

router.post("/", async (req, res) => {
  const { name, description, price, available } = req.body;
  try {
    const product = await Product.create({
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
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json({ products });
});

// Consultar producto
router.get("/:id", async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findOne({ _id: productId });
  if (product) {
    res.json({ product });
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

// Actualizar producto
router.put("/:id", async (req, res) => {
  const productId = req.params.id;
  const { name, description, price, available } = req.body;
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId },
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
router.delete("/:id", async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findOneAndDelete({ _id: productId });
  if (product) {
    res.json({ product });
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

module.exports = router;
