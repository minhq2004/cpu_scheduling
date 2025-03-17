export interface Process {
  id: number;
  allocation: number[];
  max: number[];
  need?: number[];
}

export interface SystemState {
  processes: Process[];
  totalResources: number[];
  resourceNames: string[];
}

export interface ExecutionStep {
  step: number;
  processId: number;
  work: number[];
  finish: boolean[];
  message: string;
}

export interface ExecutionResult {
  isSafe: boolean;
  safeSequence: number[];
  message: string;
  steps: ExecutionStep[];
}

export interface Request {
  processId: number;
  resources: number[];
}
