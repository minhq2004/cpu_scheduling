import { Process, ScheduleResult } from "./type";

export const RR = (processes: Process[], quantum: number): ScheduleResult => {
  const remainingProcesses = processes
    .map((p) => ({
      ...p,
      remainingTime: p.burstTime,
      firstRun: -1,
      waitingTime: 0,
      lastEndTime: p.arrivalTime, // Lưu thời điểm tiến trình cuối cùng được chạy
    }))
    .sort((a, b) => a.arrivalTime - b.arrivalTime);

  let currentTime = remainingProcesses[0]?.arrivalTime || 0;
  const ganttChart: { process: number; start: number; end: number }[] = [];
  const resultProcesses: { id: number; waitingTime: number; responseTime: number; turnAroundTime: number; }[] = [];
  const readyQueue: typeof remainingProcesses = [];
  const unfinishedJobs = [...remainingProcesses];
  const remainingTime = Object.fromEntries(remainingProcesses.map((p) => [p.id, p.remainingTime]));

  readyQueue.push(unfinishedJobs.shift()!);
  const lastExecutionTime: Record<number, number> = {}; // Lưu thời điểm cuối cùng tiến trình được chạy

  while (unfinishedJobs.length > 0 || readyQueue.length > 0) {
    if (readyQueue.length === 0 && unfinishedJobs.length > 0) {
      readyQueue.push(unfinishedJobs[0]);
      currentTime = readyQueue[0].arrivalTime;
    }

    const currentProcess = readyQueue.shift()!;

    if (currentProcess.firstRun === -1) {
      currentProcess.firstRun = currentTime;
    }

    const executionTime = Math.min(quantum, remainingTime[currentProcess.id]);
    const start = currentTime;
    const end = start + executionTime;
    currentTime = end;
    
    // Cập nhật tổng thời gian chờ thực tế 
    if (lastExecutionTime[currentProcess.id] !== undefined) {
      currentProcess.waitingTime += start - lastExecutionTime[currentProcess.id];
    } else {
      currentProcess.waitingTime += start - currentProcess.arrivalTime;
    }

    lastExecutionTime[currentProcess.id] = end; // Cập nhật lần chạy cuối cùng

    ganttChart.push({ process: currentProcess.id, start, end });
    remainingTime[currentProcess.id] -= executionTime;

    const newArrivals = unfinishedJobs.filter((p) => p.arrivalTime <= currentTime && !readyQueue.includes(p));
    readyQueue.push(...newArrivals);
    unfinishedJobs.splice(0, newArrivals.length);

    if (remainingTime[currentProcess.id] > 0) {
      readyQueue.push(currentProcess);
    } else {
      const completionTime = currentTime;
      const turnAroundTime = completionTime - currentProcess.arrivalTime;
      const responseTime = currentProcess.firstRun - currentProcess.arrivalTime;

      resultProcesses.push({
        id: currentProcess.id,
        waitingTime: currentProcess.waitingTime,
        responseTime,
        turnAroundTime,
      });
    }
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

