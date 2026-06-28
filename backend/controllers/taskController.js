const Task = require("../models/Task");

// ─── GET /api/tasks ───────────────────────────────────────────────────────────
// Supports: ?status=todo|in-progress|done  ?priority=low|medium|high
//           ?sort=createdAt|dueDate|title  ?order=asc|desc
//           ?search=<string>
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, sort = "createdAt", order = "desc", search } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const sortDir = order === "asc" ? 1 : -1;
    const tasks = await Task.find(filter).sort({ [sort]: sortDir });

    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/tasks/:id ───────────────────────────────────────────────────────
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/tasks ──────────────────────────────────────────────────────────
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body;
    const task = await Task.create({ title, description, status, priority, dueDate, tags });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/tasks/:id ───────────────────────────────────────────────────────
const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, dueDate, tags },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/tasks/:id ────────────────────────────────────────────────────
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /api/tasks/:id/status ─────────────────────────────────────────────
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus };
