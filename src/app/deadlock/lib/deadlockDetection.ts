import { SystemState, DetectionResult, DetectionStep } from "../types/type";

export function detectDeadlock(state: SystemState): DetectionResult {
  const numProcesses = state.processes.length;
  const numResources = state.totalResources.length;

  const available = state.totalResources.map(
    (total, i) =>
      total - state.processes.reduce((sum, p) => sum + p.allocation[i], 0)
  );

  const work = available;

  const finish = state.processes.map((process) =>
    process.allocation.every((resource) => resource === 0)
  );

  const steps: DetectionStep[] = [];
  let stepCount = 0;

  if (available.some((v) => v < 0)) {
    return {
      hasDeadlock: true,
      deadlockedProcesses: [],
      message: "Invalid state: Negative resources detected",
      steps: [],
    };
  }

  steps.push({
    step: stepCount++,
    processId: -1,
    work: [...available],
    finish: [...finish],
    message: "Initial state",
  });

  // Detect processes that can complete
  let running: boolean;
  do {
    running = false;
    for (let i = 0; i < numProcesses; i++) {
      if (!finish[i]) {
        const process = state.processes[i];

        const canComplete = process.request.every(
          (req, j) => req <= available[j]
        );

        if (canComplete) {
          for (let j = 0; j < numResources; j++) {
            work[j] += process.allocation[j];
          }
          finish[i] = true;
          running = true;

          steps.push({
            step: stepCount++,
            processId: process.id,
            work: [...work],
            finish: [...finish],
            message: `Process P${process.id} completes and releases resources`,
          });
        }
      }
    }
  } while (running);

  const deadlockedProcesses = state.processes
    .filter((_, i) => !finish[i])
    .map((p) => p.id);

  if (deadlockedProcesses.length > 0) {
    steps.push({
      step: stepCount++,
      processId: -1,
      work: [...work],
      finish: [...finish],
      message: `Deadlock detected with processes: P${deadlockedProcesses.join(
        ", P"
      )}`,
    });

    return {
      hasDeadlock: true,
      deadlockedProcesses,
      message: `Deadlock detected involving processes: P${deadlockedProcesses.join(
        ", P"
      )}`,
      steps,
    };
  }

  steps.push({
    step: stepCount++,
    processId: -1,
    work: [...work],
    finish: [...finish],
    message: "All processes can complete - No deadlock",
  });

  return {
    hasDeadlock: false,
    deadlockedProcesses: [],
    message: "No deadlock detected",
    steps,
  };
}
