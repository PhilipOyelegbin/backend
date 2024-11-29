const { Router } = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { authenticated, authorized } = require("../handler");

const router = Router();

/**
 * @swagger
 * /api/checkout:
 *   post:
 *     summary: Payment enpoint for products
 *     security:
 *       - bearerAuth: []
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
 *                 type: number
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               quantity:
 *                 type: number
 *             required:
 *               - amount
 *               - name
 *               - description
 *               - quantity
 *     responses:
 *       301:
 *         description: Payment successfully, redirecting to payment page
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  "/checkout",
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
              unit_amount: parseInt(amount) * 100,
            },
            quantity: parseInt(quantity),
          },
        ],
        mode: "payment",
        success_url: `${process.env.BASE_URL}/feedback`,
        cancel_url: `${process.env.BASE_URL}`,
      });

      res.status(301).redirect(session.url);
    } catch (error) {
      res.status(500).json({ message: "Error", error });
    }
  }
);

module.exports = router;
