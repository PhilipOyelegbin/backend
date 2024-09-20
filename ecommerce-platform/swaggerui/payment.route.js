const { authenticated, authorized } = require("../middleware");

/**
 * @swagger
 * /api/checkout:
 *   post:
 *     summary: Payment enpoint for products
 *     tags:
 *       - Payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               quantity:
 *                 type: string
 *             required:
 *               - amount
 *               - name
 *               - description
 *               - quantity
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
 *                 amount:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 quantity:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

// endpoint for payments
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
