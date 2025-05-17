// src/routes/tasks.js
import { Router } from "express";
import { authenticate, authorizeTaskAction } from "../middleware/auth.js";
import { createTask, deleteTask, getAlltasks, getTaskById, updateTask } from "../controllers/task.js";

const router = Router();

/**
 * POST /api/v1/tasks
 */
router.post("/", authenticate, createTask);

/**
 * GET /api/v1/tasks
 */
router.get("/", authenticate, getAlltasks);

/**
 * PUT /api/v1/tasks/:id
 */
router.put("/:id", authenticate, authorizeTaskAction, updateTask);

/**
 * DELETE /api/v1/tasks/:id
 */
router.delete("/:id", authenticate, authorizeTaskAction, deleteTask);

/**
 * GET /api/v1/tasks/:id
 */
router.get("/:id", authenticate, getTaskById);

export default router;
