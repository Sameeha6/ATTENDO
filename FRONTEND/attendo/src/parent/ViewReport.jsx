import { useParams } from "react-router-dom";

export default function Report() {
  const { ward } = useParams();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl font-bold">Report for {ward}</h1>
      <p className="text-lg mt-4">Attendance details will be shown here.</p>
    </div>
  );
}
