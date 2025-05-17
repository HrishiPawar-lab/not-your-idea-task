import { useEffect, useState } from "react";
import { connectSocket } from "../../utils/socket";
import { useGetTasks } from "./service";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import TaskColumn from "../../components/DragAndDrop/TaskColumn";
import toast from "react-hot-toast";

let socket;

const Dashboard = () => {
  const [tasksByStatus, setTasksByStatus] = useState({
    "To Do": [],
    "In Progress": [],
    Done: [],
  });
  const [activeId, setActiveId] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    socket = connectSocket();

    socket.on("connection", (data) => {
      console.log("Connected:", data);
    });

    socket.on("task-reordered", ({ taskId, status, updatedPositions }) => {
      setTasksByStatus((prev) => {
        const updated = { ...prev };

        // Reorder tasks based on updatedPositions
        const reorderedTasks = [...updated[status]];
        reorderedTasks.sort(
          (a, b) =>
            updatedPositions.find((p) => p.id === a._id)?.position -
            updatedPositions.find((p) => p.id === b._id)?.position
        );

        updated[status] = reorderedTasks;
        return updated;
      });
    });

    socket.on("task-updated", ({ taskId, newStatus, newIndex }) => {
      setTasksByStatus((prev) => {
        let movedTask;
        const updated = { ...prev };

        // Find and remove the task from its current status
        for (const status in updated) {
          updated[status] = updated[status].filter((task) => {
            if (task._id === taskId) {
              movedTask = task;
              return false;
            }
            return true;
          });
        }

        if (movedTask) {
          movedTask.status = newStatus;

          // If newIndex is provided, insert at specific position
          if (newIndex !== undefined) {
            updated[newStatus].splice(newIndex, 0, movedTask);
          } else {
            updated[newStatus].push(movedTask);
          }
        }

        return updated;
      });
    });

    socket.on("task-deleted", ({ taskId }) => {
      setTasksByStatus((prev) => {
        const updated = {};

        for (const status in prev) {
          updated[status] = prev[status].filter((task) => task._id !== taskId);
        }

        return updated;
      });
    });

    socket.on("task-created", (newTask) => {
      setTasksByStatus((prev) => {
        const updated = { ...prev };
        const exists = updated[newTask.status].some(task => task._id === newTask._id);
        if (!exists) {
          updated[newTask.status] = [...updated[newTask.status], newTask];
        }
        return updated;
      });
    });

    socket.on("task-updated", (updatedTask) => {
      if (!updatedTask?.status) {
        console.error("⚠️ Task update received without valid status:", updatedTask);
        return;
      }

      setTasksByStatus((prev) => {
        const updated = { ...prev };
        for (const status in updated) {
          updated[status] = updated[status].filter(task => task._id !== updatedTask._id);
        }
        if (updated.hasOwnProperty(updatedTask.status)) {
          updated[updatedTask.status] = [...updated[updatedTask.status], updatedTask];
        } else {
          console.warn("⚠️ Unknown status column:", updatedTask.status);
        }

        return updated;
      });

    });






  }, []);

  const { data, error, isLoading } = useGetTasks({
    setTasksByStatus,
  });

  const findTaskById = (id) => {
    for (const status in tasksByStatus) {
      const task = tasksByStatus[status].find((task) => task._id === id);
      if (task) return task;
    }
    return null;
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    setActiveTask(findTaskById(active.id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const taskId = active.id;

    // Handle moving between columns (status change)
    if (over.id in tasksByStatus) {
      const newStatus = over.id;
      const currentStatus = findTaskStatus(taskId);

      if (currentStatus === newStatus) return;

      setTasksByStatus((prev) => {
        let movedTask;
        const updated = { ...prev };

        for (const status in updated) {
          updated[status] = updated[status].filter((task) => {
            if (task._id === taskId) {
              movedTask = task;
              return false;
            }
            return true;
          });
        }

        if (movedTask) {
          movedTask.status = newStatus;
          updated[newStatus].push(movedTask);

          // Emit socket event for status change
          socket &&
            socket?.emit("task-updated", {
              taskId,
              newStatus,
            });
        }
        return updated;

      });
      toast.success("Task Updated")
    }
    // Handle reordering within a column
    else {
      const status = findTaskStatus(taskId);
      const oldIndex = tasksByStatus[status].findIndex(
        (task) => task._id === taskId
      );
      const newIndex = tasksByStatus[status].findIndex(
        (task) => task._id === over.id
      );

      if (oldIndex === newIndex) return;

      setTasksByStatus((prev) => {
        const updated = { ...prev };
        updated[status] = arrayMove(updated[status], oldIndex, newIndex);

        // Emit socket event for reordering
        socket &&
          socket.emit("task-reordered", {
            taskId,
            status,
            oldIndex,
            newIndex,
          });

        toast.success("Task Reorderd")
        return updated;
      });
    }
  };

  const handleDeleteTask = (taskId) => {
    setTasksByStatus((prev) => {
      const updated = { ...prev };

      for (const status in updated) {
        updated[status] = updated[status].filter((task) => task._id !== taskId);
      }

      // Emit socket event for deletion
      socket?.emit("task-deleted", { taskId });

      return updated;
    });
  };

  const findTaskStatus = (taskId) => {
    for (const status in tasksByStatus) {
      if (tasksByStatus[status].some((task) => task._id === taskId)) {
        return status;
      }
    }
    return null;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="p-6 text-black bg-orange-50 h-full">
        <h2 className="mb-4 text-3xl font-bold text-orange-600">Dashboard</h2>
        <div className="flex justify-between gap-4">
          {Object.keys(tasksByStatus).map((status) => (
            <TaskColumn
              key={status}
              id={status}
              title={status}
              tasks={tasksByStatus[status]}
              handleDeleteTask={handleDeleteTask}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeId && activeTask ? (
          <div className="p-2 bg-white rounded shadow border-2 border-orange-400">
            <h3 className="font-semibold">{activeTask.title}</h3>
            <p className="text-sm text-gray-600 truncate">
              {activeTask.description}
            </p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Dashboard;
