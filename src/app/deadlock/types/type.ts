export interface Process {
  id: number;
  allocation: number[];
  request: number[];
}

export interface SystemState {
  processes: Process[];
  totalResources: number[];
  resourceNames: string[];
}

export interface DetectionStep {
  step: number;
  processId: number;
  work: number[];
  finish: boolean[];
  message: string;
}

export interface DetectionResult {
  hasDeadlock: boolean;
  deadlockedProcesses: number[];
  message: string;
  steps: DetectionStep[];
}
