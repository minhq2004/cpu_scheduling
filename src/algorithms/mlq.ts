import { Process, Queue, ScheduleResult } from "@/algorithms/type";
import { FCFS } from "@/algorithms/fcfs";
import { SJFN } from "@/algorithms/sjfn";
import { SJFP } from "@/algorithms/sjfp";
import { PN } from "@/algorithms/pn";
import { PP } from "@/algorithms/pp";
import { RR } from "@/algorithms/rr";

export const MLQ = (queues: Queue[]): ScheduleResult => {
  let currentTime = 0;
  let processCounter = 1;
  const processMapping = new Map<number, number>();
  let ganttChart: { process: number; start: number; end: number }[] = [];
  let allProcesses: { id: number; waitingTime: number; responseTime: number; turnAroundTime: number }[] = [];

  queues.forEach((queue) => {
    let result: ScheduleResult;
    switch (queue.algorithm) {
      case "FCFS":
        result = FCFS(queue.processes);
        break;
      case "SJFN":
        result = SJFN(queue.processes);
        break;
      case "SJFP":
        result = SJFP(queue.processes);
        break;
      case "PriorityN":
        result = PN(queue.processes);
        break;
      case "PriorityP":
        result = PP(queue.processes);
        break;
      case "RR":
        result = RR(queue.processes, queue.quantum || 1);
        break;
      default:
        result = { ganttChart: [], processes: [], avg: { avgWaitingTime: 0, avgResponseTime: 0, avgTurnAroundTime: 0 } };
    }
    
    result.ganttChart.forEach((entry) => {
        if (!processMapping.has(entry.process)) {
          processMapping.set(entry.process, processCounter++);
        }
        ganttChart.push({ 
          process: processMapping.get(entry.process)!, 
          start: currentTime, 
          end: currentTime + (entry.end - entry.start) 
        });
        currentTime += entry.end - entry.start;
    });

    allProcesses = [...allProcesses, ...result.processes.map((p, index) => ({
      id: allProcesses.length + index + 1, 
      waitingTime: p.waitingTime,
      responseTime: p.responseTime,
      turnAroundTime: p.turnAroundTime
    }))];
  });

  return {
    ganttChart,
    processes: allProcesses,
    avg: {
      avgWaitingTime: allProcesses.reduce((sum, p) => sum + p.waitingTime, 0) / allProcesses.length || 0,
      avgResponseTime: allProcesses.reduce((sum, p) => sum + p.responseTime, 0) / allProcesses.length || 0,
      avgTurnAroundTime: allProcesses.reduce((sum, p) => sum + p.turnAroundTime, 0) / allProcesses.length || 0,
    },
  };
};