import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableTask from "./SortableTask";

const TaskColumn = ({ id, title, tasks, handleDeleteTask }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-1/3 p-4 rounded-lg shadow-md ${isOver ? "bg-orange-100" : "bg-gray-100"
        } transition-colors duration-200`}
    >
      <h2 className="mb-2 text-lg font-bold">{title}</h2>
      {tasks.length === 0 ? (
        <p className="text-sm text-gray-500 p-2">No tasks</p>
      ) : (
        <SortableContext
          items={tasks.filter((task) => task.canEditOrDelete).map((task) => task._id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <SortableTask key={task._id} task={task} handleDeleteTask={handleDeleteTask} />
          ))}
        </SortableContext>
      )}
    </div>
  );
};

export default TaskColumn;
