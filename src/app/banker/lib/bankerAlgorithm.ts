import {
  SystemState,
  ExecutionResult,
  ExecutionStep,
  Request,
} from "../types/banker";

export function calculateBankersAlgorithm(state: SystemState): ExecutionResult {
  const n = state.processes.length;
  const m = state.totalResources.length;

  const processes = state.processes.map((p) => ({
    ...p,
    need: p.max.map((max, i) => max - p.allocation[i]),
  }));

  const available = calculateAvailable(state);
  const work = [...available];
  const finish = new Array(n).fill(false);
  const safeSequence: number[] = [];
  const steps: ExecutionStep[] = [];
  let stepCount = 0;

  const isValidState =
    work.every((v) => v >= 0) &&
    processes.every((p) => p.need.every((n) => n >= 0));

  if (!isValidState) {
    return {
      isSafe: false,
      safeSequence: [],
      message: "Invalid state: Negative resources detected",
      steps: [],
    };
  }

  steps.push({
    step: stepCount++,
    processId: -1,
    work: [...work],
    finish: [...finish],
    message: "Initial state",
  });

  let count = 0;
  while (count < n) {
    let found = false;

    for (let i = 0; i < n; i++) {
      if (!finish[i] && processes[i].need.every((need, j) => need <= work[j])) {
        for (let j = 0; j < m; j++) {
          work[j] += processes[i].allocation[j];
        }

        safeSequence.push(processes[i].id);
        finish[i] = true;
        found = true;
        count++;

        steps.push({
          step: stepCount++,
          processId: processes[i].id,
          work: [...work],
          finish: [...finish],
          message: `Process P${processes[i].id} can execute`,
        });
      }
    }

    if (!found) {
      steps.push({
        step: stepCount++,
        processId: -1,
        work: [...work],
        finish: [...finish],
        message: "No process can execute - Unsafe state",
      });

      return {
        isSafe: false,
        safeSequence,
        message: "System is in an unsafe state - deadlock possible",
        steps,
      };
    }
  }

  return {
    isSafe: true,
    safeSequence,
    message: "System is in a safe state",
    steps,
  };
}

export function calculateAvailable(state: SystemState): number[] {
  return state.totalResources.map(
    (total, i) =>
      total - state.processes.reduce((sum, p) => sum + p.allocation[i], 0)
  );
}

export function checkResourceRequest(
  state: SystemState,
  request: Request
): ExecutionResult {
  const n = state.processes.length;
  const m = state.totalResources.length;

  const tempProcesses = state.processes.map((p) => ({
    ...p,
    need: p.max.map((max, i) => max - p.allocation[i]),
  }));

  const available = calculateAvailable(state);

  const processIdx = tempProcesses.findIndex((p) => p.id === request.processId);
  if (processIdx === -1) {
    return {
      isSafe: false,
      safeSequence: [],
      message: "Invalid process ID",
      steps: [],
    };
  }

  const process = tempProcesses[processIdx];
  const isRequestValid = request.resources.every(
    (req, i) => req <= process.need[i] && req <= available[i]
  );

  if (!isRequestValid) {
    return {
      isSafe: false,
      safeSequence: [],
      message: "Request exceeds need or available resources",
      steps: [],
    };
  }

  const tempAvailable = available.map((val, i) => val - request.resources[i]);
  tempProcesses[processIdx].allocation = process.allocation.map(
    (val, i) => val + request.resources[i]
  );
  tempProcesses[processIdx].need = process.need.map(
    (val, i) => val - request.resources[i]
  );

  const work = [...tempAvailable];
  const finish = new Array(n).fill(false);
  const safeSequence: number[] = [];
  const steps: ExecutionStep[] = [];
  let stepCount = 0;

  steps.push({
    step: stepCount++,
    processId: -1,
    work: [...work],
    finish: [...finish],
    message: `Initial state after granting P${request.processId}'s request`,
  });

  let count = 0;
  while (count < n) {
    let found = false;

    for (let i = 0; i < n; i++) {
      if (
        !finish[i] &&
        tempProcesses[i].need.every((need, j) => need <= work[j])
      ) {
        for (let j = 0; j < m; j++) {
          work[j] += tempProcesses[i].allocation[j];
        }

        safeSequence.push(tempProcesses[i].id);
        finish[i] = true;
        found = true;
        count++;

        steps.push({
          step: stepCount++,
          processId: tempProcesses[i].id,
          work: [...work],
          finish: [...finish],
          message: `Process P${tempProcesses[i].id} can execute`,
        });
      }
    }

    if (!found) {
      steps.push({
        step: stepCount++,
        processId: -1,
        work: [...work],
        finish: [...finish],
        message: "No process can execute - Unsafe state",
      });

      return {
        isSafe: false,
        safeSequence,
        message: "Request would lead to an unsafe state",
        steps,
      };
    }
  }

  return {
    isSafe: true,
    safeSequence,
    message: "Request can be safely granted",
    steps,
  };
}
