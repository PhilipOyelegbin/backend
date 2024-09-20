const {
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controller/user.controller");
const { authenticated, authorized } = require("../middleware");

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A list of users
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
 *                   email:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   role:
 *                     type: string
 *                   password:
 *                     type: string
 *   post:
 *     summary: Create a new user
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Register
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   role:
 *                     type: string
 *                   password:
 *                     type: string
 *             required:
 *               - name
 *               - email
 *               - phoneNumber
 *               - password
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *                     role:
 *                       type: string
 *                     password:
 *                       type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 * /api/users/{id}:
 *   get:
 *     summary: Retrieve a user
 *     tags:
 *       - Users
 *     parameters:
 *       - in : path
 *         name: id
 *     responses:
 *       200:
 *         description: A user data
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
 *                   email:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   role:
 *                     type: string
 *                   password:
 *                     type: string
 *   patch:
 *     summary: Update a user data
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
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
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   role:
 *                     type: string
 *                   password:
 *                     type: string
 *             required:
 *               - name
 *               - email
 *               - phoneNumber
 *               - password
 *     responses:
 *       201:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   role:
 *                     type: string
 *                   password:
 *                     type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a user
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
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
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *             required:
 *               - name
 *               - email
 *               - phoneNumber
 *               - password
 *     responses:
 *       201:
 *         description: User deleted successfully
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

// endpoint for users
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
