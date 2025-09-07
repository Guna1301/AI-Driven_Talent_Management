import { useState, useRef, useEffect } from "react";
import axiosInstance from "../../services/axiosInstance";

export default function ResourceUploadModal({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [resource, setResource] = useState({
    name: "",
    role: "",
    experience: "",
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
  if (!csvFile && !resource.name) return;

  setIsLoading(true);
    try {
      const formData = new FormData();

      if (csvFile) formData.append("file", csvFile);

      formData.append("name", resource.name);
      formData.append("role", resource.role);
      formData.append("experience", resource.experience);

      const { data } = await axiosInstance.post("/resources/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Server response:", data);
      alert("Resource submitted successfully!");

      setCsvFile(null);
      setResource({ name: "", role: "", experience: "" });
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to submit resource");
    } finally {
      setIsLoading(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50 animate-fadeIn"
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

        <h2 className="text-xl font-semibold mb-4 text-white">
          Upload Resource
        </h2>

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
            {csvFile ? csvFile.name : "Upload file for resources"}
          </div>
          <div className="px-4 py-2 border text-white border-gray-400 rounded hover:bg-gray-700 transition cursor-pointer">
            Choose File
          </div>
        </div>
        <span className="text-sm text-gray-500 flex justify-center items-center">Or</span>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-white">
              Name
            </label>
            <input
              type="text"
              value={resource.name}
              onChange={(e) =>
                setResource({ ...resource, name: e.target.value })
              }
              placeholder="Enter resource name"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-violet-500 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-white">
              Role
            </label>
            <input
              type="text"
              value={resource.role}
              onChange={(e) =>
                setResource({ ...resource, role: e.target.value })
              }
              placeholder="Enter resource role"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-violet-500 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-white">
              Experience (years)
            </label>
            <input
              type="number"
              value={resource.experience}
              onChange={(e) =>
                setResource({ ...resource, experience: e.target.value })
              }
              placeholder="Enter experience"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-violet-500 text-white"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || (!csvFile && !resource.name)}
          className={`w-full py-2 mt-6 rounded ${
            isLoading || (!csvFile && !resource.name)
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-violet-500 hover:bg-violet-600"
          } transition`}
        >
          {isLoading ? "Submitting..." : "Submit Resource"}
        </button>
      </div>
    </div>
  );
}
