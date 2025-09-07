import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { dummyProjects } from '../../constants/constants';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarGraph = () => {
  const defaultDomains = ['AI', 'UI/UX', 'FSD', 'Mobile', 'Cloud', 'Data Science'];

  const projectDomains = Array.from(new Set(dummyProjects.map(p => p.domain)));

  const allDomains = Array.from(new Set([...defaultDomains, ...projectDomains]));

  const domainCount = dummyProjects.reduce((acc, project) => {
    acc[project.domain] = (acc[project.domain] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: allDomains,
    datasets: [
      {
        label: 'Number of Projects',
        data: allDomains.map(domain => domainCount[domain] || 0),
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Projects by Domain' },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.05)' } },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarGraph;
