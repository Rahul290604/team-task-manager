import { useEffect, useState } from "react";
import API from "../api";
import { getUserFromToken } from "../utils";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const user = getUserFromToken();

  const fetchTasks = () => {
    API.get("/tasks").then((res) => setTasks(res.data));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/tasks/${id}`, { status });
    fetchTasks();
  };

  const createTask = async () => {
    if (!title || !description) return;

    await API.post("/tasks", {
      title,
      description,
      projectId: "69f321e19213dcccda950e4f",
      assignedTo: user.id,
    });

    setTitle("");
    setDescription("");
    fetchTasks();
  };

  // 📊 Stats
  const total = tasks.length;

  const completed = tasks.filter((t) => t.status === "done").length;

  const pending = tasks.filter((t) => t.status !== "done").length;

  const overdue = tasks.filter((t) => {
    if (!t.createdAt) return false;

    const created = new Date(t.createdAt);
    const now = new Date();

    const diffDays = (now - created) / (1000 * 60 * 60 * 24);

    return t.status !== "done" && diffDays > 3;
  }).length;

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard 🧠</h1>

      <p>Role: {user?.role}</p>

      {/* 📊 Stats */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div style={{ padding: "10px", border: "1px solid gray", borderRadius: "10px" }}>
          📦 Total: {total}
        </div>

        <div style={{ padding: "10px", border: "1px solid gray", borderRadius: "10px" }}>
          ✅ Completed: {completed}
        </div>

        <div style={{ padding: "10px", border: "1px solid gray", borderRadius: "10px" }}>
          ⏳ Pending: {pending}
        </div>

        <div style={{ padding: "10px", border: "1px solid gray", borderRadius: "10px" }}>
          ⚠️ Overdue: {overdue}
        </div>
      </div>

      {/* 🟢 ADMIN ONLY: Create Task */}
      {user?.role === "admin" && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Create Task</h3>

          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <br /><br />

          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <br /><br />

          <button onClick={createTask}>Create Task</button>
        </div>
      )}

      <h3>Tasks:</h3>

      {/* 📋 Task List */}
      {tasks.map((t) => (
        <div key={t._id} style={{ marginBottom: "20px" }}>
          <strong>{t.title}</strong>
          <br />
          Status: {t.status}
          <br />
          Assigned: {t.assignedTo?.name}
          <br />

          {/* 🔘 Status Buttons */}
          <button onClick={() => updateStatus(t._id, "todo")}>
            Todo
          </button>

          <button onClick={() => updateStatus(t._id, "in-progress")}>
            In Progress
          </button>

          <button onClick={() => updateStatus(t._id, "done")}>
            Done
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
}
