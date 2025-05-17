import { Server } from "socket.io";
import Task from "../schemas/task.js";
import AuditLog from "../schemas/auditlog.js";

let ioInstance = null;

export const initSocketIo = (server) => {
  ioInstance = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  ioInstance.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Emit initial connection confirmation
    socket.emit("connection", { message: "Connected to server" });

    // Handle task status update (when a task is moved between columns)
    socket.on("task-updated", async ({ taskId, newStatus }) => {
      try {
        // Find the task
        const task = await Task.findById(taskId);
        if (!task) {
          console.error("Task not found:", taskId);
          return;
        }

        // Get the old status for audit
        const oldStatus = task.status;

        // Update the task
        task.status = newStatus;
        await task.save();

        // Create an audit log
        await AuditLog.create({
          task: taskId,
          user: task.createdBy, // Using the creator as we don't have socket authentication
          action: "update",
          changes: {
            status: [oldStatus, newStatus],
          },
        });

        // Broadcast to all clients including sender
        ioInstance.emit("task-updated", { taskId, newStatus });

        console.log(`Task ${taskId} moved to ${newStatus}`);
      } catch (err) {
        console.error("Error updating task status:", err);
      }
    });

    // Handle task reordering within a column
    socket.on(
      "task-reordered",
      async ({ taskId, status, oldIndex, newIndex }) => {
        console.log("reordered");
        try {
          // Find all tasks in the same status column, ordered by position
          const tasksInColumn = await Task.find({ status })
            .sort({ position: 1 })
            .lean();

          // Calculate new positions for tasks
          const updatedTasks = [...tasksInColumn];
          const [movedTask] = updatedTasks.splice(oldIndex, 1);
          updatedTasks.splice(newIndex, 0, movedTask);

          // Update positions for all affected tasks
          const updates = updatedTasks.map((task, index) =>
            Task.findByIdAndUpdate(task._id, { position: index }, { new: true })
          );

          await Promise.all(updates);

          // Create audit log for the moved task
          await AuditLog.create({
            task: taskId,
            user: movedTask.createdBy,
            action: "reorder",
            changes: {
              position: [oldIndex, newIndex],
            },
          });

          // Broadcast the reordering to all clients
          ioInstance.emit("task-reordered", {
            taskId,
            status,
            oldIndex,
            newIndex,
            // Send updated positions to ensure all clients are in sync
            updatedPositions: updatedTasks.map((task, index) => ({
              id: task._id,
              position: index,
            })),
          });

          console.log(
            `Task ${taskId} reordered from position ${oldIndex} to ${newIndex} in ${status}`
          );
        } catch (err) {
          console.error("Error reordering task:", err);
        }
      }
    );

    // Handle task deletion
    socket.on("task-deleted", async ({ taskId }) => {
      try {
        const task = await Task.findById(taskId);
        if (!task) {
          console.error("Task not found:", taskId);
          return;
        }

        const deletedTaskData = {
          _id: task._id,
          title: task.title,
          status: task.status,
        };

        // Delete the task
        await Task.deleteOne({ _id: taskId });

        // Log the deletion in AuditLog
        await AuditLog.create({
          task: taskId,
          user: task.createdBy,
          action: "delete",
          changes: {
            deleted: true,
          },
        });

        // Emit to all clients that a task was deleted
        ioInstance.emit("task-deleted", {
          taskId,
          deletedTaskData,
        });

        console.log(`Task ${taskId} deleted`);
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
};

export const getSocketIo = () => {
  if (!ioInstance) {
    throw new Error("Socket.io has not been initialized!");
  }
  return ioInstance;
};

export const emitIoEvent = (eventName, data) => {
  if (!ioInstance) {
    console.error("Socket.io not initialized!");
    return;
  }
  ioInstance.emit(eventName, data);
};
