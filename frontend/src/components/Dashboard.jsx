import { useEffect, useState } from "react";

import Navbar from "./Navbar";
import TaskForm from "./TaskForm";
import TaskCard from "./TaskCard";


function Dashboard() {

  const [showForm, setShowForm] = useState(false);

  const [tasks, setTasks] = useState([]);

  const [editingTask, setEditingTask] = useState(null);

  const [loading, setLoading] = useState(true);


  const token = localStorage.getItem("token");


  // ===============================
  // GET TASKS
  // ===============================

  const fetchTasks = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      const data = await response.json();
      console.log("Updated Task Returned:", data);

      if (!response.ok) {
        throw new Error(data.message);
      }


      setTasks(data);

    } catch (error) {

      console.error("Fetch tasks error:", error);

    } finally {

      setLoading(false);

    }

  };


  // Load tasks when dashboard opens

  useEffect(() => {

    if (token) {
      fetchTasks();
    } else {
      setLoading(false);
    }

  }, []);


  // ===============================
  // CREATE TASK
  // ===============================

  const addTask = async (task) => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/tasks",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(task),
        }
      );


      const data = await response.json();


      if (!response.ok) {
        alert(data.message);
        return;
      }


      setTasks((prevTasks) => [
        data,
        ...prevTasks,
      ]);


      setShowForm(false);

    } catch (error) {

      console.error("Create task error:", error);

    }

  };


  // ===============================
  // DELETE TASK
  // ===============================

  const deleteTask = async (id) => {

    try {

      const response = await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      const data = await response.json();


      if (!response.ok) {
        alert(data.message);
        return;
      }


      setTasks((prevTasks) =>
        prevTasks.filter(
          (task) => task._id !== id
        )
      );

    } catch (error) {

      console.error("Delete task error:", error);

    }

  };


  // ===============================
  // START EDIT
  // ===============================

  const startEdit = (task) => {

    setEditingTask(task);

    setShowForm(true);

  };


  // ===============================
// UPDATE TASK
// ===============================

const updateTask = async (id, updatedTask) => {

  try {

    console.log("Updating:", updatedTask);

    const response = await fetch(
      `http://localhost:5000/api/tasks/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(updatedTask),
      }
    );

    const data = await response.json();

    console.log("Updated Response:", data);

    if (!response.ok) {
      alert(data.message);
      return;
    }

    // Refresh tasks from database
    await fetchTasks();

    setEditingTask(null);
    setShowForm(false);

  } catch (error) {

    console.error("Update task error:", error);

  }

};
// ===============================
// COMPLETE TASK
// ===============================

const completeTask = async (task) => {

  try {
    console.log("Completing task:", task);
    const response = await fetch(
      `http://localhost:5000/api/tasks/${task._id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: "Completed",
          dueDate: task.dueDate,
        }),
      }
    );

    const data = await response.json();
    console.log("Response:", data);
    if (!response.ok) {
      alert(data.message);
      return;
    }

    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t._id === task._id ? data : t
      )
    );

  } catch (error) {

    console.error("Complete task error:", error);

  }

};

  // ===============================
  // CANCEL EDIT
  // ===============================

  const cancelEdit = () => {

    setEditingTask(null);

    setShowForm(false);

  };


  // ===============================
  // LOADING
  // ===============================

  if (loading) {

    return (
      <div>
        <Navbar />

        <main className="dashboard">

          <h2>Loading tasks...</h2>

        </main>
      </div>
    );

  }


  return (
    <div>

      <Navbar />


      <main className="dashboard">


        {/* HEADER */}

        <div className="dashboard-header">

          <div>

            <h1>
              Welcome back 👋
            </h1>

            <p>
              Manage and track your tasks easily.
            </p>

          </div>


          <button
            onClick={() => {

              setEditingTask(null);

              setShowForm(!showForm);

            }}
          >
            + Add Task
          </button>

        </div>


        {/* STATS */}

        <div className="stats">


          <div className="stat-card">

            <h3>
              {tasks.length}
            </h3>

            <p>
              Total Tasks
            </p>

          </div>


          <div className="stat-card">

            <h3>
              {
                tasks.filter(
                  (task) =>
                    task.status === "Pending"
                ).length
              }
            </h3>

            <p>
              Pending
            </p>

          </div>


          <div className="stat-card">

            <h3>
              {
                tasks.filter(
                  (task) =>
                    task.status === "In Progress"
                ).length
              }
            </h3>

            <p>
              In Progress
            </p>

          </div>


          <div className="stat-card">

            <h3>
              {
                tasks.filter(
                  (task) =>
                    task.status === "Completed"
                ).length
              }
            </h3>

            <p>
              Completed
            </p>

          </div>


        </div>


        {/* FORM */}

        {showForm && (

          <TaskForm
            onAddTask={addTask}
            onUpdateTask={updateTask}
            editingTask={editingTask}
            onCancelEdit={cancelEdit}
          />

        )}


        {/* TASKS */}

        <section className="tasks-section">

          <h2>
            My Tasks
          </h2>


          {tasks.length === 0 ? (

            <p>
              No tasks yet. Click "+ Add Task" to create your first task.
            </p>

          ) : (

            <div className="task-grid">

              {tasks.map((task) => (

                <TaskCard
                  key={task._id}
                  task={task}
                  onDelete={deleteTask}
                  onEdit={startEdit}
                  onComplete={completeTask}
                />

              ))}

            </div>

          )}

        </section>


      </main>

    </div>
  );
}


export default Dashboard;