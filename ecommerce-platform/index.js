const process = require("node:process")
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { swaggerUi, specs } = require("./swagger");
const sequelize = require("./connection");
const path = require("path");
const { authenticate, hashPassword } = require("./auth");
const { syncDatabase } = require("./model");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
} = require("./controller/user.controller");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
} = require("./controller/product.controller");
const {
  getAllCategory,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
} = require("./controller/category.controller");
const {
  getAllCarts,
  getCartById,
  createCart,
  updateCartById,
  deleteCartById,
} = require("./controller/cart.controller");
const { authenticated, authorized, decodeToken } = require("./middleware");

process.loadEnvFile('.env');

const app = express();
app.set("view engine", "ejs");
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use("/", swaggerUi.serve, swaggerUi.setup(specs)); // Swagger setup

// ----------------------- Authenticate user and generate token -----------------------
app.post("/api/login", async (req, res) => {
  const { email, password } = await req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  try {
    const token = await authenticate(email, password);
    res.status(201).json({ message: "Authenticate successfully", token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// ----------------------- Logout function -----------------------
app.post("/api/logout", (req, res) => {
  // Assuming you're using sessions
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to log out" });
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    res.status(200).json({ message: "Logged out successfully" });
  });
});

// ----------------------- CRUD operations for users -----------------------
app.get("/api/users", authenticated, authorized("Admin"), async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ message: "All users received successfully", users });
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/users", async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;

  // Check if all fields are filled
  if (!name || !email || !phoneNumber || !password) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }

  // create the user
  try {
    const user = await createUser({
      name,
      email,
      phoneNumber,
      password: await hashPassword(password),
    });
    res.status(201).json({ message: "User saved successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/users/:id", authenticated, async (req, res) => {
  const id = req.params.id;

  // Check if id was provided
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  try {
    const user = await getUserById(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json({ message: "User gotten successfully", user });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/users/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  const data = req.body;
  try {
    const user = await updateUserById(id, data);
    res.status(201).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete(
  "/api/users/:id",
  authenticated,
  authorized("Admin"),
  async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }
    try {
      await deleteUserById(id);
      res.status(200).json({ message: "User deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// ----------------------- CRUD operations for products -----------------------
app.get("/api/products", async (req, res) => {
  try {
    const products = await getAllProducts();
    res
      .status(200)
      .json({ message: "All products received successfully", products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post(
  "/api/products",
  authenticated,
  authorized("Admin"),
  async (req, res) => {
    const { name, description, price, stock } = req.body;
    if (!name || !description || !price || !stock) {
      return res.status(400).json({ message: "All fields are required" });
    }
    try {
      const product = await createProduct({ name, description, price, stock });
      res.status(201).json({ message: "Product saved successfully", product });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

app.get("/api/products/:id", authenticated, async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  try {
    const product = await getProductById(id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.status(200).json({ message: "Product gotten successfully", product });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/products/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  const data = req.body;
  try {
    const product = updateProductById(id, data);
    res.status(201).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete(
  "/api/products/:id",
  authenticated,
  authorized("Admin"),
  async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }
    try {
      await deleteProductById(id);
      res.status(200).json({ message: "Product deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// ----------------------- CRUD operations for category -----------------------
app.get("/api/categories", authenticated, async (req, res) => {
  try {
    const categories = await getAllCategory();
    res
      .status(200)
      .json({ message: "All categories received successfully", categories });
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
});

app.post(
  "/api/categories",
  authenticated,
  authorized("Admin"),
  async (req, res) => {
    const { name, description } = req.body;

    // Check if all fields are filled
    if (!name || !description) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    // create the category
    try {
      const category = await createCategory({
        name,
        description,
      });
      res.status(201).json({ message: "User saved successfully", category });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

app.get("/api/categories/:id", authenticated, async (req, res) => {
  const id = req.params.id;

  // Check if id was provided
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  try {
    const category = await getCategoryById(id);
    if (!category) {
      res.status(404).json({ error: "Category not found" });
    } else {
      res
        .status(200)
        .json({ message: "Category gotten successfully", category });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/categories/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  const data = req.body;
  try {
    const category = await updateCategoryById(id, data);
    res
      .status(201)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete(
  "/api/categories/:id",
  authenticated,
  authorized("Admin"),
  async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }
    try {
      await deleteCategoryById(id);
      res.status(200).json({ message: "Categories deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// ----------------------- CRUD operations for carts -----------------------
app.get("/api/carts", authenticated, async (req, res) => {
  try {
    const carts = await getAllCarts();
    res.status(200).json({ message: "All carts received successfully", carts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/carts", authenticated, async (req, res) => {
  const data = req.body;
  try {
    const cart = await createCart(data);
    res.status(201).json({ message: "Cart created successfully", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/carts/:id", authenticated, async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  try {
    const cart = await getCartById(id);
    res.status(200).json({ message: "Carts viewd successfully", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/carts/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  const data = req.body;
  try {
    const cart = await updateCartById(id, data);
    res.status(201).json({ message: "Carts updated successfully", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/carts/:id", authenticated, async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  try {
    await deleteCartById(id);
    res.status(201).json({ message: "Cart deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------------- endpoint to handle the creation of a payment ---------------------
app.post(
  "/api/checkout",
  authenticated,
  authorized("User"),
  async (req, res) => {
    const { amount, name, description, quantity } = req.body;

    if (!amount || !name || !description || !quantity) {
      return res.status(400).json({ message: "A required field is missing!" });
    }

    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name, description },
              unit_amount: amount * 100,
            },
            quantity,
          },
        ],
        mode: "payment",
        success_url: `${process.env.BASE_URL}/feedback`,
        cancel_url: `${process.env.BASE_URL}`,
      });

      res.status(201).redirect(session.url);
    } catch (error) {
      res.status(500).json({ message: "Error", error });
    }
  }
);

app.get("/feedback", (req, res) => {
  res.status(201).render("feedback")
})

// ----------------------- start server -----------------------
syncDatabase();

const port = process.env.PORT;
app.listen(port, async () => {
  console.log("Server listening on port", port);
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
