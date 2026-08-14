const express = require("express");

const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ===============================
// GET ALL TASKS
// ===============================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(tasks);

  } catch (error) {

    console.error("GET TASKS ERROR:", error);

    res.status(500).json({
      message: "Unable to fetch tasks.",
    });

  }
});


// ===============================
// CREATE TASK
// ===============================

router.post("/", authMiddleware, async (req, res) => {
  try {

    const {
      title,
      description,
      priority,
      status,
      dueDate,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Task title is required.",
      });
    }

    const task = await Task.create({
      user: req.userId,
      title,
      description,
      priority: priority || "Medium",
      status: status || "Pending",
      dueDate,
    });

    res.status(201).json(task);

  } catch (error) {

    console.error("CREATE TASK ERROR:", error);

    res.status(500).json({
      message: "Unable to create task.",
    });

  }
});


// ===============================
// UPDATE TASK
// ===============================

router.put("/:id", authMiddleware, async (req, res) => {
  try {

    console.log("UPDATE BODY:", req.body);

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId,
      },
      {
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        status: req.body.status,
        dueDate: req.body.dueDate,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    console.log("UPDATED TASK:", task);

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    res.status(200).json(task);

  } catch (error) {

    console.error("UPDATE TASK ERROR:", error);

    res.status(500).json({
      message: "Unable to update task.",
    });

  }
});


// ===============================
// DELETE TASK
// ===============================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully.",
    });

  } catch (error) {

    console.error("DELETE TASK ERROR:", error);

    res.status(500).json({
      message: "Unable to delete task.",
    });

  }
});

module.exports = router;