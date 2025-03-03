import { Process, ScheduleResult } from "./type";

export const SJFN = (processes: Process[]): ScheduleResult => {
  const tempProcesses = [...processes];

  let currentTime = 0;
  const ganttChart: { process: number; start: number; end: number }[] = [];
  const resultProcesses: {
    id: number;
    waitingTime: number;
    responseTime: number;
    turnAroundTime: number;
  }[] = [];

  // Sao chép mảng tiến trình và sắp xếp
  const remainingProcesses = [...tempProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime)];

  while (remainingProcesses.length > 0) {
    // Lọc các tiến trình đã đến và chưa được thực thi
    const availableProcesses = remainingProcesses.filter(
      (p) => p.arrivalTime <= currentTime
    );

    // Nếu không có tiến trình nào đến, tăng currentTime
    if (availableProcesses.length === 0) {
      currentTime++;
      continue;
    }

    // Chọn tiến trình có burstTime ngắn nhất
    const nextProcess = availableProcesses.reduce((prev, curr) =>
      curr.burstTime < prev.burstTime ? curr : prev
    );

    const waitingTime = Math.max(0, currentTime - nextProcess.arrivalTime);
    const turnAroundTime = waitingTime + nextProcess.burstTime;

    ganttChart.push({
      process: nextProcess.id,
      start: currentTime,
      end: currentTime + nextProcess.burstTime,
    });

    resultProcesses.push({
      id: nextProcess.id,
      waitingTime,
      responseTime: waitingTime,
      turnAroundTime,
    });

    // Cập nhật currentTime
    currentTime += nextProcess.burstTime;

    // Loại bỏ tiến trình đã được thực thi khỏi danh sách chờ
    remainingProcesses.splice(remainingProcesses.indexOf(nextProcess), 1);
  }

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

  return { ganttChart, processes: resultProcesses, avg:averages };
};