export interface Process {
  id: number;
  arrivalTime: number;
  burstTime: number;
  priority?: number;
}

export interface Queue {
  id: number;
  algorithm: string;
  quantum?: number;
  processes: Process[];
}

export interface ScheduleResult {
  ganttChart: { process: number; start: number; end: number }[];
  processes: {
    id: number;
    waitingTime: number;
    responseTime: number;
    turnAroundTime: number;
  }[];
  avg: {
    avgWaitingTime: number;
    avgResponseTime: number;
    avgTurnAroundTime: number;
  } 
}
