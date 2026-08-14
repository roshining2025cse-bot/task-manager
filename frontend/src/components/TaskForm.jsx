import { useEffect, useState } from "react";

function TaskForm({ onAddTask, onUpdateTask, editingTask, onCancelEdit }) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Pending");
  const [dueDate, setDueDate] = useState("");


  useEffect(() => {

    if (editingTask) {

      setTitle(editingTask.title || "");
      setDescription(editingTask.description || "");
      setPriority(editingTask.priority || "Medium");
      setStatus(editingTask.status || "Pending");
      setDueDate(editingTask.dueDate || "");

    } else {

      setTitle("");
      setDescription("");
      setPriority("Medium");
      setStatus("Pending");
      setDueDate("");

    }

  }, [editingTask]);


  const handleSubmit = (e) => {

    e.preventDefault();

    const taskData = {
      title,
      description,
      priority,
      status,
      dueDate,
    };
    console.log("Task Data:", taskData);

    if (editingTask) {

      onUpdateTask(editingTask._id, taskData);

    } else {

      onAddTask(taskData);

    }

  };


  return (
    <div className="task-form-card">

      <h2>
        {editingTask ? "Edit Task" : "Add New Task"}
      </h2>


      <form onSubmit={handleSubmit}>

        <label>Task Title</label>

        <input
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />


        <label>Description</label>

        <textarea
          placeholder="Describe your task"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />


        <label>Priority</label>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>


        <label>Status</label>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>


        <label>Due Date</label>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />


        <button type="submit">
          {editingTask ? "Update Task" : "Create Task"}
        </button>


        {editingTask && (
          <button
            type="button"
            onClick={onCancelEdit}
          >
            Cancel
          </button>
        )}

      </form>

    </div>
  );
}

export default TaskForm;