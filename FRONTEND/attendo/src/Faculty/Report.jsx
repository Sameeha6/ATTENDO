import React from "react";

const FacultyReport = () => {
  const subjects = [
    {
      name: "WIT",
      totalHours: 40,
      students: [
        { regno:"IEAWEIT01" ,name: "fidha", mark: 4 },
        { regno:"IEAWEIT02" ,name: "lamiya", mark: 5 },
        { regno:"IEAWEIT03" ,name: "najiya", mark: 3 },
      ],
    },
  ];

  return (
    <div className="bg-gray-50 font-sans min-h-screen p-4 mt-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Subject Report</h1>
      <div className="space-y-6">
        {subjects.map((subject, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800">
              {subject.name}
            </h2>
            <p className="text-gray-600">
              Total Hours: <span className="font-bold">{subject.totalHours}</span>
            </p>
            <table className="w-full mt-3 border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2 text-left">RegNo</th>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Mark (out of 5)</th>

                </tr>
              </thead>
              <tbody>
                {subject.students.map((student, idx) => (
                  <tr key={idx} className="border">
                    <td className="border p-2">{student.regno}</td>
                    <td className="border p-2">{student.name}</td>
                    <td className="border p-2">{student.mark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyReport;