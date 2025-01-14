import React, { useState, useEffect } from 'react';

function TaskForm({ onAddTask, editingTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [reminderDate, setReminderDate] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setDueDate(editingTask.dueDate);
      setAssignedTo(editingTask.assignedTo);
      setReminderDate(editingTask.reminderDate);
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && description && dueDate) {
      onAddTask({ title, description, dueDate, assignedTo, reminderDate });
      setTitle('');
      setDescription('');
      setDueDate('');
      setAssignedTo('');
      setReminderDate('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="task-title" className="block text-sm font-medium">
          Task Name
        </label>
        <input
          type="text"
          id="task-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
          required
        />
      </div>
      <div>
        <label htmlFor="task-desc" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="task-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
          required
        ></textarea>
      </div>
      <div>
        <label htmlFor="task-due" className="block text-sm font-medium">
          Due Date
        </label>
        <input
          type="date"
          id="task-due"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
          required
        />
      </div>
      <div>
        <label htmlFor="task-assigned" className="block text-sm font-medium">
          Assign To
        </label>
        <input
          type="text"
          id="task-assigned"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
        />
      </div>
      <div>
        <label htmlFor="task-reminder" className="block text-sm font-medium">
          Reminder Date
        </label>
        <input
          type="date"
          id="task-reminder"
          value={reminderDate}
          onChange={(e) => setReminderDate(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        {editingTask ? 'Update Task' : 'Add Task'}
      </button>
    </form>
  );
}

export default TaskForm;
