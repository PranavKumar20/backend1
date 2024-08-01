const express = require("express");
const { Users, Todos } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

const router = express.Router();

// Helper function to validate email format
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

router.post("/signup", async (req, res) => {
  const { email, fullname, password } = req.body;

  if (!email || !fullname || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ msg: "Invalid email format" });
  }

  const existingUser = await Users.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ msg: "Email is already taken" });
  }

  try {
    const user = await Users.create({ email, fullname, password });
    const userId = user._id;
    const token = jwt.sign({ userId }, JWT_SECRET);
    res.status(201).json({ msg: "Signup successful", token, userId });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ msg: "Invalid email format" });
  }

  try {
    const user = await Users.findOne({ email, password });
    if (user) {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET);
      return res.status(200).json({ msg: "Login successful", token, userId: user._id });
    }
    res.status(401).json({ msg: "Invalid email or password" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.get("/getprofile", authMiddleware, async (req, res) => {
  try {
    const user = await Users.findOne({ _id: req.userId });
    if (!user) {
      return res.status(404).json({ msg: "Profile not found" });
    }
    res.json({ msg: "User found", user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.get("/mytodos", authMiddleware, async (req, res) => {
  try {
    const myTodos = await Todos.find({ userId: req.userId });
    if (!myTodos.length) {
      return res.status(404).json({ msg: "No todos found" });
    }
    res.json({ myTodos });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.get("/userdetails", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ msg: "User ID is required" });
  }

  try {
    const user = await Users.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ msg: "Profile not found" });
    }
    res.json({ msg: "User found", email: user.email, fullname: user.fullname });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
