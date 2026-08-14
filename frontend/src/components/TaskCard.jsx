function TaskCard({ task, onDelete, onEdit, onComplete }) {

  return (
    <div className="task-card">

      <div className="task-top">

        <span className="status">
          {task.status}
        </span>

        <span className="priority">
          {task.priority}
        </span>

      </div>

      <h3>{task.title}</h3>

      <p>{task.description}</p>

      <div className="task-date">
        Due: {task.dueDate || "No due date"}
      </div>

      <div className="task-actions">

        {task.status !== "Completed" && (
          <button
            className="complete-btn"
            onClick={() => onComplete(task)}
          >
            ✓ Complete
          </button>
        )}

        <button
          className="edit-btn"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>

        <button
          className="delete-btn"
          onClick={() => onDelete(task._id)}
        >
          Delete
        </button>

      </div>

    </div>
  );
}

export default TaskCard;