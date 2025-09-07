import { useState, useRef, useEffect } from "react";
import  axiosInstance  from "../../services/axiosInstance";

export default function ProjectUploadModal({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [project, setproject] = useState({
    projectname: "",
    domain: "",
    budget: "",
    deadline: "",
    teamSize: "",
    description: "",
  });
  const [csvFile, setCsvFile] = useState(null);

  const csvInputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleCsvSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) setCsvFile(file);
  };

  const handleSubmit = async () => {
  if (!csvFile && (!project.projectname || !project.domain)) {
    return alert("Project name and domain are required");
  }

  setIsLoading(true);

  try {
    const formData = new FormData();
    if (csvFile) formData.append("csvFile", csvFile);
    formData.append("projectname", project.projectname);
    formData.append("domain", project.domain);
    formData.append("budget", project.budget);
    formData.append("deadline", project.deadline);
    formData.append("teamSize", project.teamSize);
    formData.append("description", project.description);

    const { data } = await axiosInstance.post("/projects/project-upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
      console.log("Backend response:", data);
      alert("Project submitted successfully!");

      setCsvFile(null);
      setproject({
        projectname: "",
        domain: "",
        budget: "",
        deadline: "",
        teamSize: "",
        description: "",
      });

      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to submit project");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0  bg-opacity-30 flex items-center justify-center z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg shadow-lg p-6 relative bg-gray-900 animate-slideIn"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-white">Upload project</h2>

        <input
          type="file"
          ref={csvInputRef}
          accept=""
          className="hidden"
          onChange={handleCsvSelect}
        />
        <div
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-gray-500 transition mb-4"
          onClick={() => csvInputRef.current?.click()}
        >
          <div className="text-gray-200 mb-2">
            {csvFile ? csvFile.name : "Upload file for projects (optional)"}
          </div>
          <div className="px-4 py-2 border text-white border-gray-400 rounded hover:bg-gray-700 transition cursor-pointer">
            Choose File
          </div>
        </div>
        <span className="text-sm text-gray-500 flex justify-center items-center">Or</span>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-white">
              Project Name
            </label>
            <input
              type="text"
              value={project.projectname}
              onChange={(e) =>
                setproject({ ...project, projectname: e.target.value })
              }
              placeholder="Enter project name"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-violet-500 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-white">
              Domain
            </label>
            <input
              type="text"
              value={project.domain}
              onChange={(e) =>
                setproject({ ...project, domain: e.target.value })
              }
              placeholder="Enter domain"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-violet-500 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-white">
              Budget
            </label>
            <input
              type="number"
              value={project.budget}
              onChange={(e) =>
                setproject({ ...project, budget: e.target.value })
              }
              placeholder="Enter budget"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-violet-500 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-white">
              Deadline
            </label>
            <input
              type="date"
              value={project.deadline}
              onChange={(e) =>
                setproject({ ...project, deadline: e.target.value })
              }
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-violet-500 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-white">
              Description
            </label>
            <textarea
              value={project.description}
              onChange={(e) =>
                setproject({ ...project, description: e.target.value })
              }
              placeholder="Enter description"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-violet-500 text-white"
              rows={3}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading && !project.projectname && !project.domain && !csvFile}
          className={`w-full py-2 mt-6 rounded ${
            isLoading || (!csvFile && !project.name)

              ? "bg-gray-600 cursor-not-allowed"
              : "bg-violet-500 hover:bg-violet-600"
          } transition`}
        >
          {isLoading ? "Submitting..." : "Submit project"}
        </button>
      </div>
    </div>
  );
}
