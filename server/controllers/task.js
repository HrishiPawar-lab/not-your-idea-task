import Task from "../schemas/task.js"
import AuditLog from "../schemas/auditlog.js"
import ApiResponse from "../utils/apiResponse.js";
import { emitIoEvent } from "../utils/socket.js";

export const createTask = async (req, res) => {
    try {
        const task = await Task.create({
            ...req.body,
            createdBy: req.user.sub,
        });

        await AuditLog.create({
            task: task._id,
            user: req.user.sub,
            action: "create",
            changes: {},
        });

        emitIoEvent("task-created", task);


        return res
            .status(201)
            .json(new ApiResponse(true, task, "Task created successfully"));
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json(new ApiResponse(false, {}, "Internal Server Error"));
    }
}

export const getAlltasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate("createdBy", "username role");

        const userId = req.user.sub;
        const userRole = req.user.role;

        const updatedTasks = tasks.map((task) => {
            const isOwner = task.createdBy._id.toString() === userId;
            const isAdmin = userRole === "admin";

            return {
                ...task.toObject(),
                canEditOrDelete: isAdmin || isOwner,
            };
        });

        return res.json(new ApiResponse(true, updatedTasks, "Tasks fetched"));
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json(new ApiResponse(false, {}, "Internal Server Error"));
    }
}


export const updateTask = async (req, res) => {
    try {
        const oldTask = await Task.findById(req.params.id).lean();
        if (!oldTask) {
            return res.status(404).json(new ApiResponse(false, {}, "Task not found"));
        }

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        }).lean();

        // compute diff
        const diff = {};
        Object.keys(req.body).forEach((field) => {
            if (String(oldTask[field]) !== String(updatedTask[field])) {
                diff[field] = [oldTask[field], updatedTask[field]];
            }
        });

        await AuditLog.create({
            task: updatedTask._id,
            user: req.user.sub,
            action: "update",
            changes: diff,
        });

        emitIoEvent("task-updated", updatedTask);

        return res.json(new ApiResponse(true, updatedTask, "Task updated"));
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json(new ApiResponse(false, {}, "Internal Server Error"));
    }
}

export const deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json(new ApiResponse(false, {}, "Task not found"));
        }

        await AuditLog.create({
            task: req.params.id,
            user: req.user.sub,
            action: "delete",
            changes: {},
        });

        emitIoEvent("taskDeleted", req.params.id);

        return res.json(new ApiResponse(true, {}, "Task deleted successfully"));
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json(new ApiResponse(false, {}, "Internal Server Error"));
    }
}

export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).lean();

        if (!task) {
            return res.status(404).json(new ApiResponse(false, {}, "Task not found"));
        }

        return res.json(new ApiResponse(true, task, "Task fetched successfully"));
    } catch (err) {
        console.error("Error fetching task:", err);
        return res
            .status(500)
            .json(new ApiResponse(false, {}, "Internal Server Error"));
    }
}