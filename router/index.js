const express = require("express");
const userRouter = require("./user");
const todosRouter = require("./todos");

const router = express.Router();

router.use("/user", userRouter);
router.use("/todos", todosRouter);

module.exports = router;
