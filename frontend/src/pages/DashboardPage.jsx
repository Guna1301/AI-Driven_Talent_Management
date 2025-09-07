import { useState } from "react";
import Card from "../components/dashboard/Card";
import PieChart from "../components/dashboard/PieChart";
import BarGraph from "../components/dashboard/BarGraph";
import Table from "../components/dashboard/Table";
import ResourceUploadModal from "../components/dashboard/ResourceUpload";

const DashboardPage = () => {
  const [showResourceUpload, setShowResourceUpload] = useState(false);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <Card title="Total Projects" value="7" link="/projects" />
            <Card title="Total Resources" value="15" link="/resources" />
          </div>

          <div className="flex items-center">
            <button
              className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              onClick={() => setShowResourceUpload(true)}
            >
              + Upload Resources
            </button>
          </div>
        </div>

        <ResourceUploadModal
          isOpen={showResourceUpload}
          onClose={() => setShowResourceUpload(false)}
        />

        <div className="w-full rounded-lg shadow h-full overflow-auto">
          <Table />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="lg:w-1/2 rounded-lg shadow bg-white p-4 h-96">
            <PieChart
              title="Project Status"
              budget={10000}
              spend={4500}
              save={5500}
            />
          </div>
          <div className="lg:w-1/2 flex justify-center items-center rounded-lg shadow bg-white p-4 h-96">
            <BarGraph />
          </div>
        </div>

        {/* 
        <div className="p-4 rounded-lg shadow bg-white">
          <h3 className="text-lg font-semibold mb-4">Demand vs Supply</h3>
          <Heatmap roles={roles} yearlyData={yearlyData} />
        </div> 
        */}
      </div>
    </div>
  );
};

export default DashboardPage;
