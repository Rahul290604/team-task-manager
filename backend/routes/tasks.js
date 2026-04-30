const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const auth = require("../middleware/auth");

// CREATE TASK (ADMIN ONLY)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied" });
  }

  const task = await Task.create(req.body);
  res.json(task);
});

// GET TASKS (ANY LOGGED-IN USER)
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find()
    .populate("assignedTo", "name email")
    .populate("projectId", "name");

  res.json(tasks);
});

// UPDATE STATUS (ANY USER)
router.put("/:id", auth, async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  res.json(task);
});
module.exports = router;