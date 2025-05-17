import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdEdit, MdAutoDelete, MdDragHandle } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const SortableTask = ({ task, handleDeleteTask }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const navigate = useNavigate()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (!task.canEditOrDelete) {
    return (

      <div title="This task cannot be edited " className="cursor-not-allowed">
        <div className="p-2 mb-3 bg-white rounded shadow transition-shadow duration-200 cursor-default">
          <h3 className="font-bold text-lg text-orange-500">{task.title}</h3>
          <p className="text-md text-gray-600">{task.description}</p>
          <span className="text-xs text-gray-400">{task.status}</span>
          <p className="text-xs text-gray-400">{task?.createdBy?.username}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="p-2 mb-3 bg-white rounded shadow-md transition-shadow duration-200"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-orange-500">{task.title}</h3>
        <div {...listeners} className="cursor-grab text-gray-400">
          <MdDragHandle size={20} />
        </div>
      </div>

      <p className="text-sm text-gray-600">{task?.description}</p>
      <span className="text-xs text-gray-400">{task?.status}</span>
      <div className="flex justify-between items-center">

        <p className="text-xs text-orange-500 font-bold ">{task?.createdBy?.username}</p>
        <div className="flex gap-2 text-orange-600 justify-end mt-2">
          <MdAutoDelete
            size={25}
            className="cursor-pointer"
            onClick={() => handleDeleteTask(task?._id)}
          />
          <div onClick={() => {
            navigate(`/update-task/${task?._id}`)
          }}>
            <MdEdit size={25} className="cursor-pointer" />

          </div>
        </div>
      </div>
    </div>
  );
};

export default SortableTask;
