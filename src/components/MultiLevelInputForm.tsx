import { useState } from "react";
import { Process } from "@/algorithms/type";
import DeleteIcon from "@mui/icons-material/Delete";

interface Queue {
  id: number;
  algorithm: string;
  quantum?: number;
  processes: Process[];
}

interface MultiLevelQueueInputProps {
  onQueueChange: (queues: Queue[]) => void;
}

export default function MultiLevelQueueInput({
  onQueueChange,
}: MultiLevelQueueInputProps) {
  const [queues, setQueues] = useState<Queue[]>([]);

  const handleAddQueue = () => {
    const newQueue: Queue = {
      id: queues.length + 1,
      algorithm: "FCFS",
      processes: [],
    };
    setQueues([...queues, newQueue]);
  };

  const handleDeleteQueue = (id: number) => {
    const updatedQueues = queues.filter((queue) => queue.id !== id);
    setQueues(updatedQueues);
  };

  const handleAddProcess = (queueId: number) => {
    setQueues((prevQueues) =>
      prevQueues.map((queue) =>
        queue.id === queueId
          ? {
              ...queue,
              processes: [
                ...queue.processes,
                {
                  id: Date.now(),
                  arrivalTime: 0,
                  burstTime: 0,
                  priority: 0,
                },
              ],
            }
          : queue
      )
    );
  };

  const handleDeleteProcess = (queueId: number, processId: number) => {
    setQueues((prevQueues) =>
      prevQueues.map((queue) =>
        queue.id === queueId
          ? {
              ...queue,
              processes: queue.processes.filter(
                (process) => process.id !== processId
              ),
            }
          : queue
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQueueChange(queues);
  };

  return (
    <div className="text-black">
      <h2 className="text-lg font-bold">Hàng đợi đa cấp</h2>
      <button
        type="button"
        onClick={handleAddQueue}
        className="px-4 py-2 bg-blue-500 text-white rounded-md my-2 h-fit"
      >
        Thêm hàng đợi
      </button>

      <form onSubmit={handleSubmit} className="space-y-4">
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Lập lịch
        </button>
        {queues.map((queue) => (
          <div key={queue.id} className="border p-4 my-2 rounded-md">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-semibold">Hàng đợi {queue.id}</h3>
              <button
                onClick={() => handleDeleteQueue(queue.id)}
                className="text-red-500"
              >
                <DeleteIcon />
              </button>
            </div>
            <label className="block text-sm font-medium">Thuật toán</label>
            <select
              value={queue.algorithm}
              onChange={(e) => {
                const updatedQueues = queues.map((q) =>
                  q.id === queue.id ? { ...q, algorithm: e.target.value } : q
                );
                setQueues(updatedQueues);
              }}
              className="mt-1 block p-2 border border-gray-400 rounded-md"
            >
              <option value="FCFS">FCFS</option>
              <option value="SJFN">SJF không dừng</option>
              <option value="SJFP">SJF dừng</option>
              <option value="RR">Round Robin</option>
              <option value="PriorityN">Ưu tiên không dừng</option>
              <option value="PriorityP">Ưu tiên dừng</option>
            </select>
            {queue.algorithm === "RR" && (
              <div className="flex items-center space-x-2 mb-2">
                <p>Time quantum: </p>
                <input
                  type="number"
                  value={queue.quantum}
                  onChange={(e) => {
                    const updatedQueues = queues.map((q) =>
                      q.id === queue.id
                        ? { ...q, quantum: parseInt(e.target.value) }
                        : q
                    );
                    setQueues(updatedQueues);
                  }}
                  placeholder="Time Quantum"
                  className="mt-2 p-2 border border-gray-400 rounded-md"
                />
              </div>
            )}
            <table className="min-w-full table-footer-group border-collapse border border-gray-400 mt-4">
              <thead className="text-black">
                <tr>
                  <th className="px-6 py-3 text-left font-bold border border-gray-300">
                    Thời gian đến
                  </th>
                  <th className="px-6 py-3 text-left font-bold border border-gray-300">
                    Thời gian chạy
                  </th>
                  {queue.algorithm === "Priority" && (
                    <th className="px-6 py-3 text-left font-bold border border-gray-300">
                      Mức ưu tiên
                    </th>
                  )}
                  <th className="px-6 py-3 text-left font-bold border border-gray-300">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="border border-gray-300">
                {queue.processes.map((process, index) => (
                  <tr key={index} className="text-black">
                    <td className="px-6 py-4 whitespace-nowrap border border-gray-300">
                      <input
                        type="number"
                        placeholder="Thời gian đến"
                        value={process.arrivalTime}
                        onChange={(e) => {
                          const newProcesses = [...queue.processes];
                          newProcesses[index].arrivalTime = parseFloat(
                            e.target.value
                          );
                          setQueues((prevQueues) =>
                            prevQueues.map((q) =>
                              q.id === queue.id
                                ? { ...q, processes: newProcesses }
                                : q
                            )
                          );
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
                          const newProcesses = [...queue.processes];
                          newProcesses[index].burstTime = parseFloat(
                            e.target.value
                          );
                          setQueues((prevQueues) =>
                            prevQueues.map((q) =>
                              q.id === queue.id
                                ? { ...q, processes: newProcesses }
                                : q
                            )
                          );
                        }}
                        className="p-2 border border-gray-400 rounded-md"
                      />
                    </td>
                    {queue.algorithm === "Priority" && (
                      <td className="px-6 py-4 whitespace-nowrap border border-gray-300">
                        <input
                          type="number"
                          placeholder="Mức ưu tiên"
                          value={process.priority}
                          onChange={(e) => {
                            const newProcesses = [...queue.processes];
                            newProcesses[index].priority = parseInt(
                              e.target.value
                            );
                            setQueues((prevQueues) =>
                              prevQueues.map((q) =>
                                q.id === queue.id
                                  ? { ...q, processes: newProcesses }
                                  : q
                              )
                            );
                          }}
                          className="p-2 border border-gray-300 rounded-md"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap border border-gray-300">
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteProcess(queue.id, process.id)
                        }
                        className="px-4 py-2 text-red-500 rounded-md"
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              onClick={() => handleAddProcess(queue.id)}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Thêm tiến trình
            </button>
          </div>
        ))}
      </form>
    </div>
  );
}
