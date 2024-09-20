const { Category } = require("../model");

// Create new category
async function createCategory(newCategory) {
  try {
    const categories = await Category.create(newCategory);
    return categories;
  } catch (err) {
    throw err;
  }
}

// Retrieve all category
async function getAllCategory() {
  try {
    const categories = await Category.findAll();
    return categories;
  } catch (err) {
    throw err;
  }
}

// Retrieve a specific category
async function getCategoryById(id) {
  try {
    const category = await Category.findByPk(id);
    return category;
  } catch (err) {
    throw err;
  }
}

// Update a specific category
async function updateCategoryById(id, updates) {
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }
    await category.update(updates);
    return category;
  } catch (err) {
    throw err;
  }
}

// Delete a specific category
async function deleteCategoryById(id) {
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }
    await category.destroy();
    return true;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
