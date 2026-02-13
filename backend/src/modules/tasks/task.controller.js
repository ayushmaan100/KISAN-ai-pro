import * as taskService from "./task.service.js";

export const getMyTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await taskService.getTasksByUser(userId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;
    const { isCompleted } = req.body; // Expect true/false

    const updatedTask = await taskService.updateTaskStatus(taskId, userId, isCompleted);
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};