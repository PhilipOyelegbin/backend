const { where } = require("sequelize");
const { User } = require("../model");

// Create new user
async function createUser(newUser) {
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({
      where: { email: newUser.email },
    });
    if (existingUser) {
      throw new Error(`Email ${newUser.email} already exists`);
    }

    const user = await User.create(newUser);
    return user;
  } catch (err) {
    throw err;
  }
}

// Retrieve all users
async function getAllUsers() {
  try {
    const users = await User.findAll();
    return users;
  } catch (err) {
    throw err;
  }
}

// Retrieve a specific user
async function getUserById(id) {
  try {
    const user = await User.findByPk(id);
    return user;
  } catch (err) {
    throw err;
  }
}

async function updateUserById(id, updates) {
  try {
    id = parseInt(id);
    const [affectedRows, [updatedUser]] = await User.update(updates, {
      where: { id },
      returning: true, // This option returns the updated user
      individualHooks: true, // Ensures hooks are run for each instance
    });
    if (affectedRows === 0) {
      throw new Error(`User with id ${id} not found`);
    }
    return updatedUser;
  } catch (err) {
    throw err;
  }
}

// Delete a specific user
async function deleteUserById(id) {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    await user.destroy();
    return true;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
