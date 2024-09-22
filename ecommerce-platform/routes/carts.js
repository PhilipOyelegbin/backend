const { Router } = require("express")
const {
  createCart,
  getAllCarts,
  getCartById,
  updateCartById,
} = require("../controller/cart.controller");
const { authenticated } = require("../handler");

const router = Router()

/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Retrieve a list of carts
 *     tags:
 *       - Carts
 *     responses:
 *       200:
 *         description: A list of carts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   quantity:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   productId:
 *                     type: integer
 */
router.get("/", authenticated, async (req, res) => {
  try {
    const carts = await getAllCarts();
    res.status(200).json({ message: "All carts received successfully", carts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Create a new cart
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Carts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               userId:
 *                 type: integer
 *               productId:
 *                 type: integer
 *             required:
 *               - id
 *               - quantity
 *               - userId
 *               - productId
 *     responses:
 *       201:
 *         description: Carts created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cart:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                     userId:
 *                       type: integer
 *                     productId:
 *                       type: integer
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/", authenticated, async (req, res) => {
  const data = req.body;
  try {
    const cart = await createCart(data);
    res.status(201).json({ message: "Cart created successfully", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Retrieve a cart
 *     tags:
 *       - Carts
 *     parameters:
 *       - in : path
 *         name: id
 *     responses:
 *       200:
 *         description: A cart retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   quantity:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   productId:
 *                     type: integer
 */
router.get("/:id", authenticated, async (req, res) => {
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

/**
 * @swagger
 * /{id}:
 *   patch:
 *     summary: Update a cart data
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Carts
 *     parameters:
 *       - in : path
 *         name: id
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               userId:
 *                 type: integer
 *               productId:
 *                 type: integer
 *             required:
 *               - id
 *               - quantity
 *               - userId
 *               - productId
 *     responses:
 *       201:
 *         description: Cart updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cart:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                     userId:
 *                       type: integer
 *                     productId:
 *                       type: integer
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.patch("/:id", async (req, res) => {
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

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a cart
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Carts
 *     parameters:
 *       - in : path
 *         name: id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               userId:
 *                 type: integer
 *               productId:
 *                 type: integer
 *             required:
 *               - id
 *               - quantity
 *               - userId
 *               - productId
 *     responses:
 *       201:
 *         description: Cart deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authenticated, async (req, res) => {
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

module.exports = router