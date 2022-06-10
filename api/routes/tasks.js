const express = require("express");
const {
  createTask,
  updateTask,
  deleteTask,
  getTask,
  getTasks,
} = require("../controllers/task.js");

const router = express.Router();

//CREATE
router.post("/", createTask);

//UPDATE
router.put("/:id", updateTask);
//DELETE
router.delete("/:id", deleteTask);
//GET
router.get("/:id", getTask);
//GET ALL
router.get("/", getTasks);

module.exports = router;