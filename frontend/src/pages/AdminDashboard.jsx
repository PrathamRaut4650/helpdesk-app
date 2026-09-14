import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");

  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
         `${import.meta.env.VITE_API_URL}/api/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEmployees(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEmployees();
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/tasks`,
        {
          title,
          description,
          priority,
          assignedTo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Task created successfully!");

      setTitle("");
      setDescription("");
      setPriority("medium");
      setAssignedTo("");

      // Refresh the task list
      fetchTasks();
    } catch (error) {
      console.log(error);
      setMessage("Failed to create task");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="mx-auto max-w-7xl p-6">
        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-600">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-gray-900">
            Create and manage employee tasks
          </p>
        </div>

        {/* Create Task Section */}
        <div className="mb-10 rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            Create New Task
          </h2>

          <form
            onSubmit={handleCreateTask}
            className="grid gap-5 md:grid-cols-2"
          >
            {/* Task Title */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Task Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block font-medium text-gray-700">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                required
                rows="4"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Assign Employee */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Assign Employee
              </label>

              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Select employee</option>

                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.username} - {employee.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700"
              >
                Create Task
              </button>
            </div>
          </form>

          {message && (
            <p className="mt-4 rounded-lg bg-green-100 p-3 text-green-700">
              {message}
            </p>
          )}
        </div>

        {/* All Tasks Section */}
        <div>
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            All Tasks
          </h2>

          {tasks.length === 0 ? (
            <div className="rounded-xl bg-white p-6 text-gray-600 shadow-md">
              No tasks available.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="rounded-xl bg-white p-5 shadow-md transition hover:shadow-lg"
                >
                  <h3 className="mb-2 text-xl font-bold text-gray-800">
                    {task.title}
                  </h3>

                  <p className="mb-4 text-gray-600">
                    {task.description}
                  </p>

                  <div className="mb-2">
                    <span className="font-semibold text-gray-700">
                      Priority:
                    </span>{" "}
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        task.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <div>
                    <span className="font-semibold text-gray-700">
                      Status:
                    </span>{" "}
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;