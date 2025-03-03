import { Process, ScheduleResult } from "./type";

export const FCFS = (processes: Process[]): ScheduleResult => {
  const tempProcesses = [...processes];
  const sortedProcesses = tempProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);

  let currentTime = 0;
  const ganttChart: { process: number; start: number; end: number }[] = [];
  const resultProcesses: {
    id: number;
    waitingTime: number;
    responseTime: number;
    turnAroundTime: number;
  }[] = [];

  sortedProcesses.forEach((process) => {
    // Nếu currentTime nhỏ hơn thời gian đến, cập nhật currentTime để tránh khoảng trống
    if (currentTime < process.arrivalTime) {
      currentTime = process.arrivalTime;
    }

    const waitingTime = currentTime - process.arrivalTime;
    const turnAroundTime = waitingTime + process.burstTime;

    ganttChart.push({
      process: process.id,
      start: currentTime,
      end: currentTime + process.burstTime,
    });

    resultProcesses.push({
      id: process.id,
      waitingTime,
      responseTime: waitingTime,
      turnAroundTime,
    });

    currentTime += process.burstTime;
  });

  // Sắp xếp kết quả theo ID tiến trình
  resultProcesses.sort((a, b) => a.id - b.id);

  // Tính giá trị trung bình
  const totalWaitingTime = resultProcesses.reduce((sum, p) => sum + p.waitingTime, 0);
  const totalResponseTime = resultProcesses.reduce((sum, p) => sum + p.responseTime, 0);
  const totalTurnAroundTime = resultProcesses.reduce((sum, p) => sum + p.turnAroundTime, 0);

  const averages = {
    avgWaitingTime: totalWaitingTime / processes.length,
    avgResponseTime: totalResponseTime / processes.length,
    avgTurnAroundTime: totalTurnAroundTime / processes.length,
  };

  return { ganttChart, processes: resultProcesses, avg: averages };
};
