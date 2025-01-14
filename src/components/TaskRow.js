import React from 'react';

function TaskRow({ task, onToggle, onEdit, onDelete }) {
  return (
    <tr>
      <td className="border border-gray-300 px-4 py-2">{task.title}</td>
      <td className="border border-gray-300 px-4 py-2">{task.description}</td>
      <td className="border border-gray-300 px-4 py-2">{task.dueDate}</td>
      <td className="border border-gray-300 px-4 py-2">{task.assignedTo}</td>
      <td className="border border-gray-300 px-4 py-2">{task.reminderDate}</td>
      <td className="border border-gray-300 px-4 py-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.taskId)}
        />
      </td>
      <td className="border border-gray-300 px-4 py-2 space-x-2">
        <button
          onClick={() => onEdit(task.taskId)}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.taskId)}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default TaskRow;
