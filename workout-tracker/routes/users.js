const express = require("express");
const { authenticated, authorized } = require("../handler");
const UserController = require("../controller/user.controller");
const Auth = require("../auth");
const router = express.Router();

router.get(
  "/api/users",
  authenticated,
  authorized("Admin"),
  async (req, res) => {
    // #swagger.tags = ['Users']
    try {
      const users = await UserController.getAllUsers();
      res
        .status(200)
        .json({ message: "All users received successfully", users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post("/api/users", async (req, res) => {
  // #swagger.tags = ['Auth']
  const { name, email, phoneNumber, password } = req.body;
  if (!name || !email || !phoneNumber || !password) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }
  try {
    const user = await UserController.createUser({
      name,
      email,
      phoneNumber,
      password: await Auth.hashPassword(password),
    });
    res.status(201).json({ message: "User saved successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/api/users/:id", authenticated, async (req, res) => {
  /*
    #swagger.tags = ['Users']
    #swagger.security = [{"bearerAuth": []}]
  */
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  try {
    const user = await UserController.getUserById(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json({ message: "User gotten successfully", user });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/api/users/:id", authenticated, async (req, res) => {
  /*
    #swagger.tags = ['Users']
    #swagger.security = [{"bearerAuth": []}]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'User data to be updated.',
      required: false,
      schema: {
        name: "string",
        email: "string",
        phoneNumber: "string",
        password: "string"
      }
    }
  */
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  const data = req.body;
  try {
    if (data?.password) {
      const user = await UserController.updateUserById(id, {
        password: await Auth.hashPassword(data?.password),
      });
      res
        .status(200)
        .json({ message: "User password updated successfully", user });
    } else {
      const user = await UserController.updateUserById(id, data);
      res.status(200).json({ message: "User updated successfully", user });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete(
  "/api/users/:id",
  authenticated,
  authorized("Admin"),
  async (req, res) => {
    /*
    #swagger.tags = ['Users']
    #swagger.security = [{"bearerAuth": []}]
  */
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }
    try {
      await UserController.deleteUserById(id);
      res.status(200).json({ message: "User deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
