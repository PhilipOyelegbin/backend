const { authenticate } = require("../auth");

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Signin as a user
 *     tags:
 *       - Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

// endpoint for authentication
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
