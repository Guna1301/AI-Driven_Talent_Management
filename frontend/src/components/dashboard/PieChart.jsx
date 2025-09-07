import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({title="project overview", onhold = 5000, completed = 3000, active = 2000 }) => {
  const data = {
    labels: ['onhold', 'completed', 'active'],
    datasets: [
      {
        data: [onhold, completed, active],
        backgroundColor: ['#60a5fa', '#fca5a5', '#6ee7b7'],
        hoverBackgroundColor: ['#3b82f6', '#ef4444', '#10b981'],
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 14 },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <div className="rounded-2xl shadow-xl w-80 mx-auto">
      <h2 className="text-xl font-bold text-center mb-6 text-gray-700">{title}</h2>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
