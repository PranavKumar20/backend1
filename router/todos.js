const express = require("express");
const { Todos } = require("../db");
const { authMiddleware } = require("../middleware");

const router = express.Router();

router.post("/createtodos", authMiddleware, async (req, res) => {
  console.log("userid: " + req.userId);

  try {
    const todos = await Todos.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      deadline: req.body.deadline,
      userId: req.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.json({ msg: "Todos created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.put("/updatetodo/:todoid", authMiddleware, async (req, res) => {
  const todoId = req.params.todoid;
  const updateFields = req.body; // Fields to be updated

  try {
    const existingtodo = await Todos.findOne({
      _id: todoId,
      userId: req.userId,
    });

    if (!existingtodo) {
      return res
        .status(404)
        .json({ msg: "Todo not found or user unauthorized" });
    }

    for (const key in updateFields) {
      existingComplain[key] = updateFields[key];
    }

    existingtodo.updatedAt = Date.now();

    await existingtodo.save();

    res.json({ msg: "Todo updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.get("/alltodos", async (req, res) => {
  try {
    const alltodos = await Todos.find({});
    if (!alltodos)
      return res.status(403).json({ msg: "something went wrong" });
    res.json({
      msg: "todos retieved successfully",
      todos: alltodos,
    });
  } catch (error) {
    console.log(error);
    res.status(411).json({ msg: "something went wrong" });
  }
});

router.delete(
  "/deletetodo/:todoid",
  authMiddleware,
  async (req, res) => {
    const todoId = req.params.todoid;
    try {
      const existingtodo = await Todos.findOne({
        _id: todoId,
        userId: req.userId,
      });
      if (!existingtodo)
        return res
          .status(403)
          .json({ msg: "Todo you want to delete not found" });
      await existingtodo.remove();
      res.json({ msg: "Todo deleted Successfully" });
    } catch (error) {
      console.log(error);
      res.status(411).josn({ msg: "Something went wrong" });
    }
  }
);
router.get("/gettodobyid/:todoid", async (req, res) => {
  try {
    const todoId = req.params.todoid;
    const todo = await Todos.findOne({ _id: todoId });
    if (!todo) {
      return res.status(403).json({ msg: "Todo not found" });
    }
    res.json({ todo });
  } catch (error) {
    console.log(error);
    res.status(411).json({ msg: "Not able to fetch todo" });
  }
});

module.exports = router;
