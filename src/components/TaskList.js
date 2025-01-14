import React from 'react';
import TaskRow from './TaskRow';

function TaskList({ tasks, onToggle, onEdit, onDelete }) {
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="border border-gray-300 px-4 py-2">Task Name</th>
          <th className="border border-gray-300 px-4 py-2">Description</th>
          <th className="border border-gray-300 px-4 py-2">Due Date</th>
          <th className="border border-gray-300 px-4 py-2">Assigned To</th>
          <th className="border border-gray-300 px-4 py-2">Reminder Date</th>
          <th className="border border-gray-300 px-4 py-2">Completed</th>
          <th className="border border-gray-300 px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskRow
              key={task.taskId}
              task={task}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <tr>
            <td colSpan="7" className="text-center py-4">
              No tasks added yet.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default TaskList;
