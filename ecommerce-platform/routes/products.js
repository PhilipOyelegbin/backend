const { Router } = require("express");
const { authenticated, authorized } = require("../handler");
const {
  getAllProducts,
  createProduct,
  getProductById,
  updateProductById,
  deleteProductById,
} = require("../controller/product.controller");
const redisClient = require("../cache");

const router = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve a list of products
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 */
router.get("/", async (req, res) => {
  try {
    let products = null;
    const key = "products";
    const value = await redisClient.get(key);
    if (value) {
      products = JSON.parse(value);
      res
        .status(200)
        .json({ message: "All products received successfully", products });
    } else {
      products = await getAllProducts();
      await redisClient.set(key, JSON.stringify(products), { EX: 300 });
      res
        .status(200)
        .json({ message: "All products received successfully", products });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *             required:
 *               - name
 *               - description
 *               - price
 *               - stock
 *     responses:
 *       200:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     price:
 *                       type: number
 *                     stock:
 *                       type: integer
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/", authenticated, authorized("Admin"), async (req, res) => {
  const { name, description, price, stock } = req.body;
  if (!name || !description || !price || !stock) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const product = await createProduct({ name, description, price, stock });
    res.status(200).json({ message: "Product saved successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Retrieve a product
 *     tags:
 *       - Products
 *     parameters:
 *       - in : path
 *         name: id
 *     responses:
 *       200:
 *         description: A product retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 */
router.get("/:id", authenticated, async (req, res) => {
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

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update a product data
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Products
 *     parameters:
 *       - in : path
 *         name: id
 *         reqired: true
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *             required:
 *               - name
 *               - description
 *               - price
 *               - stock
 *     responses:
 *       201:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     price:
 *                       type: number
 *                     stock:
 *                       type: integer
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.patch("/:id", authenticated, async (req, res) => {
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

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Products
 *     parameters:
 *       - in : path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authenticated, authorized("Admin"), async (req, res) => {
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
});

module.exports = router;
