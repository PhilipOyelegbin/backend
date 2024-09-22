const { Router } = require("express");
const { getAllCategory, createCategory, getCategoryById, updateCategoryById, deleteCategoryById } = require("../controller/category.controller");
const { authenticated, authorized } = require("../handler");

const router = Router()

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Retrieve a list of categories
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: A list of categories
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
 *                   description:
 *                     type: string
 */
router.get("/", authenticated, async (req, res) => {
  try {
    const categories = await getAllCategory();
    res
      .status(200)
      .json({ message: "All categories received successfully", categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - id
 *               - name
 *               - description
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 category:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
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
      res.status(201).json({ message: "Category created successfully", category });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Retrieve a category
 *     tags:
 *       - Categories
 *     parameters:
 *       - in : path
 *         name: id
 *     responses:
 *       200:
 *         description: A category retrieved
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
 *                   description:
 *                     type: string
 */
router.get("/:id", authenticated, async (req, res) => {
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

/**
 * @swagger
 * /api/categories/{id}:
 *   patch:
 *     summary: Update a category data
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categories
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - id
 *               - name
 *               - description
 *     responses:
 *       201:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 category:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
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
    const category = await updateCategoryById(id, data);
    res
      .status(201)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categories
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
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - id
 *     responses:
 *       201:
 *         description: Category deleted successfully
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
router.delete(
  "/:id",
  authenticated,
  authorized("Admin"),
  async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }
    try {
      await deleteCategoryById(id);
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router