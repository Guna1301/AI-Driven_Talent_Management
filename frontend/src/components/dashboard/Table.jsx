import { useState } from "react";
import { dummyProjects } from "../../constants/constants";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Import icons

const getPriorityColor = (priority) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800";
    case "Medium":
      return "bg-yellow-100 text-yellow-800";
    case "Low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const Table = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;

  const indexOfLast = currentPage * projectsPerPage;
  const indexOfFirst = indexOfLast - projectsPerPage;
  const currentProjects = dummyProjects.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(dummyProjects.length / projectsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    let pages = [];

    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1, 2, '...', totalPages);
    }

    return pages.map((page, index) => {
      if (page === '...') {
        return (
          <span key={index} className="px-3 py-1 text-gray-500">
            ...
          </span>
        );
      }
      return (
        <button
          key={index}
          onClick={() => goToPage(page)}
          className={`px-4 py-2 rounded-md border ${
            currentPage === page
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div className="p-6 rounded-lg shadow bg-white overflow-x-auto">
      <h3 className="text-xl font-semibold mb-4">Recent Projects</h3>

      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">ID</th>
            <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Project Name</th>
            <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
            <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Start Date</th>
            <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">End Date</th>
            <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Priority</th>
          </tr>
        </thead>
        <tbody>
          {currentProjects.map((project, index) => {
            const startDate = new Date().toLocaleDateString(); // Example start date
            return (
              <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">#{indexOfFirst + index + 1}</td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">{project.name}</td>
                <td className="border border-gray-300 px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === "Active" ? "bg-green-100 text-green-800" :
                    project.status === "Completed" ? "bg-blue-100 text-blue-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {project.status}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">{startDate}</td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">{project.deadline}</td>
                <td className="border border-gray-300 px-4 py-3 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(project.priority)}`}>
                    {project.priority}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`p-2 rounded-md bg-white border border-gray-300 shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition`}
        >
          <ChevronLeft size={20} />
        </button>

        {renderPagination()}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md bg-white border border-gray-300 shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition`}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Table;
