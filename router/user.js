const express = require("express");
const { Users, Todos } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const existingUser = await Users.findOne({
    email: req.body.email,
  });
  if (existingUser) {
    return res.status(411).json({
      msg: "Credentails already taken",
    });
  }
  const user = await Users.create({
    email: req.body.email,
    fullname: req.body.fullname,
    password: req.body.password,
  });

  const userId = user._id;

  const token = jwt.sign({ userId }, JWT_SECRET);
  res.json({
    msg: "Signup Successful",
    token: token,
    userId: user._id,
  });
});


router.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);

  if (!success) {
    return res.status(403).json({
      mgs: "Incorrect Inputs",
    });
  }

  const user = await Users.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );

    return res.status(200).json({
      msg: "login succesful",
      token: token,
      userId: user._id,
    });
  }
  res.status(411).json({
    msg: "error while loggging in",
  });
});

router.get("/getprofile", authMiddleware, async (req, res) => {
  try {
    const user = await Users.findOne({
      _id: req.userId,
    });
    if (!user) {
      return res.status(404).json({ msg: "Profile not found" });
    }
    res.json({
      msg: "User found",
      user: user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.get("/mytodos", authMiddleware, async (req, res) => {
  const myTodos = await Todos.FindById(req.userId);
  if (!myTodos)
    return res.status(404).json({
      msg: "Not able to fetch your todos right now",
    });
  res.json({
      myTodos,
  });
});

router.get("/userdetails", async (req, res) => {
  try {
    const user = await Users.findOne({
      _id: req.body.userId,
    });
    if (!user) {
      return res.status(404).json({ msg: "Profile not found" });
    }
    res.json({
      msg: "User found",
      email: user.email,
      fullname: user.fullname,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
