const { Product } = require("../model");

// Create new product
async function createProduct(newProduct) {
  try {
    const product = await Product.create(newProduct);
    return product;
  } catch (err) {
    throw err;
  }
}

// Retrieve all products
async function getAllProducts() {
  try {
    const products = await Product.findAll();
    return products;
  } catch (err) {
    throw err;
  }
}

// Retrieve a specific product
async function getProductById(id) {
  try {
    const product = await Product.findByPk(id);
    return product;
  } catch (err) {
    throw err;
  }
}

// Update a specific product
async function updateProductById(id, updates) {
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    await product.update(updates);
    return product;
  } catch (err) {
    throw err;
  }
}

// Delete a specific product
async function deleteProductById(id) {
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    await product.destroy();
    return true;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
