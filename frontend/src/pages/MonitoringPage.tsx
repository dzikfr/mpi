import React, { useState } from "react";

const MonitoringPage: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: 1, label: "Check Audio", done: false },
    { id: 2, label: "Persediaan Makanan", done: true },
    { id: 3, label: "Absensi Volunteer", done: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  return (
    <div className="flex w-full gap-4 p-4 h-[calc(100vh-64px)]">
        {/* Left Panel */}
        <div className="card bg-base-300 rounded-box p-4 w-1/2 flex flex-col">
        <h2 className="text-xl font-semibold mb-2">Monitoring Event : Anifest</h2>
        <p className="text-sm">
            Duration Time : 2 days<br />
            Total Asset in-use : 10<br />
            Total Volunteers : 20 <br />
            Total Task : 3 <br />
            Total Completed Task : 2
        </p>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 flex flex-col gap-4">
        <div className="card bg-base-300 rounded-box p-4 flex-1">
            <h2 className="text-lg font-semibold mb-2">Event Status</h2>
            <p className="text-sm">All asset are in good condition</p>
        </div>

        <div className="card bg-base-300 rounded-box p-4 flex-1">
            <h2 className="text-lg font-semibold mb-2">Today's Tasks</h2>
            <ul className="space-y-2">
            {tasks.map((task) => (
                <li key={task.id} className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                    className="checkbox"
                />
                <span className={task.done ? "line-through text-gray-400" : ""}>
                    {task.label}
                </span>
                </li>
            ))}
            </ul>
        </div>
        </div>
    </div>
  );
};

export default MonitoringPage;
