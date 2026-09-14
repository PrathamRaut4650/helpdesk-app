import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tasks/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Task status updated successfully!");

      // Refresh tasks after updating
      fetchTasks();
    } catch (error) {
      console.log(error);
      setMessage("Failed to update task status");
    }
  };

  if (loading) {
    return <h2>Loading tasks...</h2>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="mx-auto max-w-6xl p-6">
        <h1 className="mb-6 text-4xl font-bold text-blue-600">
          My Tasks
        </h1>

        {message && (
          <p className="mb-4 rounded-lg bg-green-100 p-3 text-green-700">
            {message}
          </p>
        )}

        {tasks.length === 0 ? (
          <div className="rounded-xl bg-white p-6 shadow-md">
            <p>No tasks assigned to you.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="rounded-xl bg-white p-6 shadow-md"
              >
                <h2 className="mb-3 text-2xl font-bold text-gray-800">
                  {task.title}
                </h2>

                <p className="mb-4 text-gray-600">
                  {task.description}
                </p>

                <p className="mb-3">
                  <span className="font-semibold">Priority:</span>{" "}
                  {task.priority}
                </p>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    Update Status
                  </label>

                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task._id, e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTasks;