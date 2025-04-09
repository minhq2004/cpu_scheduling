import { Process, ScheduleResult } from "./type";

export const RR = (processes: Process[], quantum: number): ScheduleResult => {
  const processStates = processes
    .map((p) => ({
      ...p,
      remainingTime: p.burstTime,
      firstRun: -1,
      waitingTime: 0,
    }))
    .sort((a, b) => a.id - b.id); // Sort by ID for ascending order

  let currentTime = processStates[0]?.arrivalTime || 0;
  const ganttChart: { process: number; start: number; end: number }[] = [];
  const resultProcesses: {
    id: number;
    waitingTime: number;
    responseTime: number;
    turnAroundTime: number;
  }[] = [];
  const remainingTime = Object.fromEntries(
    processStates.map((p) => [p.id, p.remainingTime])
  );
  const lastExecutionTime: Record<number, number> = {};
  const completedProcesses = new Set<number>();

  while (processStates.some((p) => remainingTime[p.id] > 0)) {
    // Track which processes have run in this cycle
    const ranThisCycle = new Set<number>();

    // Process each available process once per cycle in ID order
    for (const currentProcess of processStates) {
      if (
        currentProcess.arrivalTime <= currentTime && // Has arrived
        remainingTime[currentProcess.id] > 0 && // Not completed
        !ranThisCycle.has(currentProcess.id) // Hasn’t run this cycle
      ) {
        if (currentProcess.firstRun === -1)
          currentProcess.firstRun = currentTime;

        const executionTime = Math.min(
          quantum,
          remainingTime[currentProcess.id]
        );
        const start = currentTime;
        const end = start + executionTime;

        currentProcess.waitingTime +=
          lastExecutionTime[currentProcess.id] !== undefined
            ? start - lastExecutionTime[currentProcess.id]
            : start - currentProcess.arrivalTime;
        lastExecutionTime[currentProcess.id] = end;

        ganttChart.push({ process: currentProcess.id, start, end });
        remainingTime[currentProcess.id] -= executionTime;
        currentTime = end;

        ranThisCycle.add(currentProcess.id);

        if (
          remainingTime[currentProcess.id] <= 0 &&
          !completedProcesses.has(currentProcess.id)
        ) {
          resultProcesses.push({
            id: currentProcess.id,
            waitingTime: currentProcess.waitingTime,
            responseTime: currentProcess.firstRun - currentProcess.arrivalTime,
            turnAroundTime: currentTime - currentProcess.arrivalTime,
          });
          completedProcesses.add(currentProcess.id);
        }
      }
    }

    // If no process ran (all arrived processes already ran this cycle or none available), move time forward
    if (ranThisCycle.size === 0) {
      const nextArrival = processStates
        .filter((p) => remainingTime[p.id] > 0)
        .reduce((min, p) => Math.min(min, p.arrivalTime), Infinity);
      if (nextArrival === Infinity) break; // No more processes to run
      currentTime = nextArrival;
    }
  }

  resultProcesses.sort((a, b) => a.id - b.id);
  const avg = {
    avgWaitingTime:
      resultProcesses.reduce((sum, p) => sum + p.waitingTime, 0) /
      processes.length,
    avgResponseTime:
      resultProcesses.reduce((sum, p) => sum + p.responseTime, 0) /
      processes.length,
    avgTurnAroundTime:
      resultProcesses.reduce((sum, p) => sum + p.turnAroundTime, 0) /
      processes.length,
  };

  return { ganttChart, processes: resultProcesses, avg };
};
