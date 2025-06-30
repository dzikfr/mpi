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

// Registrasi komponen Chart.js
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

// Data dummy
const data = {
  labels: ["January", "February", "March", "April", "May"],
  datasets: [
    {
      label: "Event",
      data: [100, 200, 150, 80, 250],
      backgroundColor: "rgba(54, 162, 235, 0.6)",
      borderColor: "rgba(54, 162, 235, 1)",
      fill: true,
      tension: 0.3,
    },
    {
      label: "Total Success",
      data: [50, 100, 75, 80, 230],
      backgroundColor: "rgba(255, 99, 132, 0.6)",
      borderColor: "rgba(255, 99, 132, 1)",
      fill: true,
      tension: 0.3,
    },
  ],
};

// Opsi chart
// const options = {
//   responsive: true,
//   plugins: {
//     legend: {
//       position: "top" as const,
//     },
//   },
// };

const DashboardPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="flex flex-wrap gap-6">
        <div className="w-full  bg-base p-4 rounded shadow">
          <Bar data={data} />
        </div>
        <div className="w-full bg-base p-4 rounded shadow">
          <Line data={data} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
