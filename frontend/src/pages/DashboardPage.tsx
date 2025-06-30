import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

// Registrasi chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Dummy data
const data = {
  labels: ["January", "February", "March", "April", "May"],
  datasets: [
    {
      label: "Event",
      data: [100, 200, 150, 80, 250],
      backgroundColor: "rgba(54, 162, 235, 0.6)",
      borderColor: "rgba(54, 162, 235, 1)",
      fill: true,
      tension: 0, // << tajam, tidak rounded
    },
    {
      label: "Total Success",
      data: [50, 100, 75, 80, 230],
      backgroundColor: "rgba(255, 99, 132, 0.6)",
      borderColor: "rgba(255, 99, 132, 1)",
      fill: true,
      tension: 0, // << tajam juga
    },
  ],
};

// Bar chart opsi horizontal
const horizontalBarOptions = {
  indexAxis: "y" as const, // << horizontal bar
  responsive: true,
  plugins: {
    legend: { position: "top" as const },
    title: {
      display: true,
      text: "Event & Success",
    },
  },
};

// Line chart opsi tajam
const lineOptions = {
  responsive: true,
  plugins: {
    legend: { position: "top" as const },
    title: {
      display: true,
      text: "Event & Success)",
    },
  },
};

const DashboardPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="flex flex-wrap gap-6">
        <div className="w-full bg-base p-4 rounded shadow">
          <Line data={data} options={lineOptions} />
        </div>
        <div className="w-full bg-base p-4 rounded shadow">
          <Bar data={data} options={horizontalBarOptions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
