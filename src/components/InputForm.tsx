import { useState } from "react";
import { Process, Queue } from "@/algorithms/type";
import DeleteIcon from "@mui/icons-material/Delete";

interface InputFormProps {
  onSchedule: (
    processes: Process[],
    algorithm: string,
    quantum?: number,
    priorityType?: string
  ) => void;
}

export default function InputForm({ onSchedule }: InputFormProps) {
  const initialState: Process[] = [
    { id: 1, arrivalTime: 0, burstTime: 2 },
    { id: 2, arrivalTime: 3, burstTime: 3 },
    { id: 3, arrivalTime: 5, burstTime: 8 },
    { id: 4, arrivalTime: 7, burstTime: 4 },
    { id: 5, arrivalTime: 9, burstTime: 5 },
  ];

  const [processes, setProcesses] = useState<Process[]>(initialState);
  const [algorithm, setAlgorithm] = useState<string>("SJFP");
  const [quantum, setQuantum] = useState<number>(1); // Thêm state để lưu giá trị quantum
  const [priorityType, setPriorityType] = useState<string>("ASC");

  const handleAddProcess = () => {
    setProcesses([
      ...processes,
      { id: processes.length + 1, arrivalTime: 0, burstTime: 0, priority: 0 },
    ]);
  };

  const resetAllProcess = () => {
    setProcesses([]);
    setQuantum(1); // Reset quantum khi làm mới
  };

  const handleDeleteProcess = (id: number) => {
    setProcesses(processes.filter((process) => process.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSchedule(processes, algorithm, quantum, priorityType);
  };

  return (
    <div>
      <div className="p-2">
        <label className="block text-md font-medium text-black">
          Thuật toán
        </label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-400 rounded-md text-black">
          <option value="FCFS">FCFS</option>
          <option value="SJFN">SJF (Không cho phép dừng)</option>
          <option value="SJFP">SJF (Cho phép dừng)</option>
          <option value="PriorityN">Ưu tiên (Không cho phép dừng)</option>
          <option value="PriorityP">Ưu tiên (Cho phép dừng)</option>
          <option value="RR">Round Robin</option>
        </select>
      </div>
      {algorithm === "RR" && (
        <div className="p-2">
          <label className="block text-md font-medium text-black">
            Time quantum
          </label>
          <input
            type="number"
            min="1"
            value={quantum}
            onChange={(e) => setQuantum(parseInt(e.target.value))}
            className="mt-1 block w-fit p-2 border border-gray-400 rounded-md text-black"
          />
        </div>
      )}
      {(algorithm === "PriorityN" || algorithm === "PriorityP") && (
        <div className="p-2 flex space-x-2">
          <label className="block text-md font-medium text-black">
            Thứ tự ưu tiên
          </label>
          <select
            value={priorityType}
            onChange={(e) => setPriorityType(e.target.value)}
            className="border border-black">
            <option value="ASC">Ưu tiên từ bé đến lớn</option>
            <option value="DESC">Ưu tiên từ lớn đến bé</option>
          </select>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <table className="min-w-full table-footer-group border-collapse border border-gray-400">
          <thead className="text-black">
            <tr>
              <th className="px-6 py-3 text-left font-bold border border-gray-300">
                Thời gian đến
              </th>
              <th className="px-6 py-3 text-left font-bold border border-gray-300">
                Thời gian chạy
              </th>
              {(algorithm == "PriorityN" || algorithm == "PriorityP") && (
                <th className="px-6 py-3 text-left font-bold border border-gray-300">
                  Mức ưu tiên
                </th>
              )}
            </tr>
          </thead>
          <tbody className="border border-gray-300">
            {processes.map((process, index) => (
              <tr key={index} className="text-black gap-0.5 ">
                <td className="px-6 py-4 whitespace-nowrap border border-gray-300">
                  <input
                    type="number"
                    placeholder="Thời gian đến"
                    value={process.arrivalTime}
                    onChange={(e) => {
                      const newProcesses = [...processes];
                      newProcesses[index].arrivalTime = parseFloat(
                        e.target.value
                      );
                      setProcesses(newProcesses);
                    }}
                    className="p-2 border border-gray-400 rounded-md"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap border border-gray-300">
                  <input
                    type="number"
                    placeholder="Thời gian chạy"
                    value={process.burstTime}
                    onChange={(e) => {
                      const newProcesses = [...processes];
                      newProcesses[index].burstTime = parseFloat(
                        e.target.value
                      );
                      setProcesses(newProcesses);
                    }}
                    className="p-2 border border-gray-400 rounded-md"
                  />
                </td>
                {(algorithm == "PriorityN" || algorithm == "PriorityP") && (
                  <td className="px-6 py-4 whitespace-nowrap border border-gray-300">
                    <input
                      type="number"
                      placeholder="Mức ưu tiên"
                      value={process.priority}
                      onChange={(e) => {
                        const newProcesses = [...processes];
                        newProcesses[index].priority = parseInt(e.target.value);
                        setProcesses(newProcesses);
                      }}
                      className="p-2 border border-gray-300 rounded-md"
                    />
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap border border-gray-300">
                  <button
                    type="button"
                    onClick={() => handleDeleteProcess(process.id)}
                    className="px-4 py-2 text-red-500 rounded-md">
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-2 space-x-1.5">
          <button
            type="button"
            onClick={handleAddProcess}
            className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Thêm tiến trình
          </button>
          <button
            type="button"
            onClick={resetAllProcess}
            className="px-4 py-2 bg-red-500 text-white rounded-md">
            Làm mới
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md">
            Lập lịch
          </button>
        </div>
      </form>
    </div>
  );
}
