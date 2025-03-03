import { ScheduleResult } from "@/algorithms/type";
import GanttChart from "./GanttChart";
interface ResultProps {
  schedule: ScheduleResult;
}

export function Result({ schedule }: ResultProps) {
  return (
    <div className="mt-8 text-black">
      <h2 className="text-xl font-bold">Biểu đồ Gantt</h2>
      <div className="flex mt-4">
        <GanttChart ganttChart={schedule.ganttChart}></GanttChart>
      </div>

      <h2 className="text-xl font-bold mt-8">Kết quả</h2>
      <table className="mt-4 w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">Tiến trình</th>
            <th className="border border-gray-400 p-2">Thời gian chờ</th>
            <th className="border border-gray-400 p-2">Thời gian phản hồi</th>
            <th className="border border-gray-400 p-2">Thời gian hoàn thành</th>
          </tr>
        </thead>
        <tbody>
          {schedule.processes.map((process) => (
            <tr key={process.id}>
              <td className="border border-gray-400 p-2">P{process.id}</td>
              <td className="border border-gray-400 p-2">
                {process.waitingTime}
              </td>
              <td className="border border-gray-400 p-2">
                {process.responseTime}
              </td>
              <td className="border border-gray-400 p-2">
                {process.turnAroundTime}
              </td>
            </tr>
          ))}
          <tr className="border border-gray-400 p-2">
            <td className="border border-gray-400 p-2">Trung bình</td>
            <td className="border border-gray-400 p-2">
              {schedule.avg.avgWaitingTime}
            </td>
            <td className="border border-gray-400 p-2">
              {schedule.avg.avgResponseTime}
            </td>
            <td className="border border-gray-400 p-2">
              {schedule.avg.avgTurnAroundTime}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
