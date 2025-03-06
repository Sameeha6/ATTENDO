import { PieChart, Pie, Cell } from 'recharts';
const data = [
  { subject: "soft computing", code: "it19", teacher: "banu", total: 10, attended: 9, color: "#28A745" },
  { subject: "soft computing", code: "it19", teacher: "banu", total: 10, attended: 9, color: "#28A745" },
  { subject: "soft computing", code: "it19", teacher: "banu", total: 10, attended: 9, color: "#28A745" },
  { subject: "soft computing", code: "it19", teacher: "banu", total: 10, attended: 9, color: "#28A745" },
  { subject: "soft computing", code: "it19", teacher: "banu", total: 10, attended: 9, color: "#28A745" },
  { subject: "soft computing", code: "it19", teacher: "banu", total: 10, attended: 9, color: "#28A745" }
];

const Subject= () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white text-black p-6 rounded-lg text-xl font-bold shadow-md flex items-center gap-3">
      Subject-wise Attendance 
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        {data.map((item, index) => {
          const percentage = ((item.attended / item.total) * 100).toFixed(2);
          return (
            <div key={index} className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
              <PieChart width={80} height={80}>
                <Pie data={[{ value: item.attended }, { value: item.total - item.attended }]} cx={40} cy={40} innerRadius={25} outerRadius={35} fill="#ddd" dataKey="value">
                  <Cell fill={item.color} />
                  <Cell fill="#ddd" />
                </Pie>
              </PieChart>
              <div>
                <p className="text-lg font-bold">{percentage}%</p>
                <p className="text-sm font-semibold">{item.subject}</p>
                <p className="text-xs text-gray-600">{item.teacher}</p>
                <p className="text-xs">Total hours: {item.total}</p>
                <p className="text-xs">Attended hours: {item.attended}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Subject;
