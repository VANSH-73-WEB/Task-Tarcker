const express = require("express");
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require("../controllers/taskController");

router.route("/").get(getTasks).post(createTask);
router.route("/:id").get(getTaskById).put(updateTask).delete(deleteTask);
router.patch("/:id/status", updateTaskStatus);

module.exports = router;
