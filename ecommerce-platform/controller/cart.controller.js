const { Cart } = require("../model");

// Create new cart
async function createCart(newCart) {
  try {
    const carts = await Cart.create(newCart);
    return carts;
  } catch (err) {
    throw err;
  }
}

// Retrieve all carts
async function getAllCarts() {
  try {
    const carts = await Cart.findAll();
    return carts;
  } catch (err) {
    throw err;
  }
}

// Retrieve a specific cart
async function getCartById(id) {
  try {
    const cart = await Cart.findByPk(id);
    return cart;
  } catch (err) {
    throw err;
  }
}

// Update a specific cart
async function updateCartById(id, updates) {
  try {
    const cart = await Cart.findByPk(id);
    if (!cart) {
      throw new Error(`Cart with id ${id} not found`);
    }
    await cart.update(updates);
    return cart;
  } catch (err) {
    throw err;
  }
}

// Delete a specific cart
async function deleteCartById(id) {
  try {
    const cart = await Cart.findByPk(id);
    if (!cart) {
      throw new Error(`Cart with id ${id} not found`);
    }
    await cart.destroy();
    return true;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createCart,
  getAllCarts,
  getCartById,
  updateCartById,
  deleteCartById,
};
