if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const connectDb = require("./config/connectDb");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

connectDb();

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "API funcionando",
    endpoints: ["/users", "/products"],
  });
});

app.use("/users", userRoutes);
app.use("/products", productRoutes);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
}

module.exports = app;
