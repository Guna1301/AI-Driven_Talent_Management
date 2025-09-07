import React, { useState } from 'react';

const ResourceHeatmapWeekly = ({ roles, yearlyData }) => {
  const years = Object.keys(yearlyData);
  const [selectedYear, setSelectedYear] = useState(years[0]);

  const data = yearlyData[selectedYear];
  const weeksCount = data[0].graph.length;

  const getColor = (value) => {
    if (!value) return '#ebedf0';
    const intensity = value / 100;
    if (intensity < 0.25) return '#c6e48b';
    if (intensity < 0.5) return '#7bc96f';
    if (intensity < 0.75) return '#239a3b';
    return '#196127';
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg overflow-auto flex">
      <div className="flex">
        <div className="flex flex-col gap-1 mr-3">
          {roles.map((role, roleIdx) => (
            <div key={roleIdx} className="text-xs text-right pr-1 h-3.5 flex items-center">
              {role}
            </div>
          ))}
        </div>

        <div className="flex gap-1">
          {Array.from({ length: weeksCount }).map((_, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1">
              {data.map((roleData, roleIdx) => (
                <div
                  key={roleIdx}
                  className="w-3 h-3.5 rounded-sm cursor-pointer"
                  style={{ backgroundColor: getColor(roleData.graph[weekIdx]) }}
                  title={`${roleData.role} - Week ${weekIdx + 1}: ${roleData.graph[weekIdx]}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="ml-6">
        <label className="block text-sm font-medium mb-2">Select Year</label>
        <select
          className="border rounded-md p-1"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ResourceHeatmapWeekly;
