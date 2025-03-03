import { Process, ScheduleResult } from "./type";

export const SJFP = (processes: Process[]): ScheduleResult => {
  const remainingProcesses = processes.map((p) => ({
    ...p,
    remainingTime: p.burstTime,
    firstRun: -1,
    waitingTime: 0,
  }));

  let currentTime = Math.min(...processes.map((p) => p.arrivalTime));
  const ganttChart: { process: number; start: number; end: number }[] = [];
  const resultProcesses: { id: number; waitingTime: number; responseTime: number; turnAroundTime: number; }[] = [];
  const lastExecutionTime: Record<number, number> = {}; // Lưu lần chạy cuối cùng của mỗi tiến trình

  while (remainingProcesses.length > 0) {
    const availableProcesses = remainingProcesses.filter(
      (p) => p.arrivalTime <= currentTime && p.remainingTime > 0
    );

    if (availableProcesses.length === 0) {
      currentTime++;
      continue;
    }

    availableProcesses.sort((a, b) => a.remainingTime - b.remainingTime);
    const currentProcess = availableProcesses[0];

    if (currentProcess.firstRun === -1) {
      currentProcess.firstRun = currentTime;
    }

    // Cập nhật thời gian chờ của tiến trình
    if (lastExecutionTime[currentProcess.id] !== undefined) {
      currentProcess.waitingTime += currentTime - lastExecutionTime[currentProcess.id];
    } else {
      currentProcess.waitingTime += currentTime - currentProcess.arrivalTime;
    }

    currentProcess.remainingTime--;

    if (ganttChart.length === 0 || ganttChart[ganttChart.length - 1].process !== currentProcess.id) {
      ganttChart.push({ process: currentProcess.id, start: currentTime, end: currentTime + 1 });
    } else {
      ganttChart[ganttChart.length - 1].end = currentTime + 1;
    }

    lastExecutionTime[currentProcess.id] = currentTime + 1; // Cập nhật thời điểm tiến trình vừa được chạy xong

    if (currentProcess.remainingTime === 0) {
      const completionTime = currentTime + 1;
      const turnAroundTime = completionTime - currentProcess.arrivalTime;
      const responseTime = currentProcess.firstRun - currentProcess.arrivalTime;

      resultProcesses.push({
        id: currentProcess.id,
        waitingTime: currentProcess.waitingTime,
        responseTime,
        turnAroundTime,
      });

      remainingProcesses.splice(remainingProcesses.indexOf(currentProcess), 1);
    }

    currentTime++;
  }

  resultProcesses.sort((a, b) => a.id - b.id);

  const totalWaitingTime = resultProcesses.reduce((sum, p) => sum + p.waitingTime, 0);
  const totalResponseTime = resultProcesses.reduce((sum, p) => sum + p.responseTime, 0);
  const totalTurnAroundTime = resultProcesses.reduce((sum, p) => sum + p.turnAroundTime, 0);

  const avg = {
    avgWaitingTime: totalWaitingTime / processes.length,
    avgResponseTime: totalResponseTime / processes.length,
    avgTurnAroundTime: totalTurnAroundTime / processes.length,
  };

  return { ganttChart, processes: resultProcesses, avg };
};
