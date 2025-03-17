"use client";
import DeleteIcon from "@mui/icons-material/Delete";

import { useState } from "react";
import { SystemState, Process } from "./types/banker";
import {
  calculateBankersAlgorithm,
  calculateAvailable,
  checkResourceRequest,
} from "./lib/bankerAlgorithm";

export default function Home() {
  const initialState: SystemState = {
    processes: [
      { id: 0, allocation: [0, 1, 0], max: [7, 5, 3] },
      { id: 1, allocation: [2, 0, 0], max: [3, 2, 2] },
      { id: 2, allocation: [3, 0, 2], max: [9, 0, 2] },
      { id: 3, allocation: [2, 1, 1], max: [2, 2, 2] },
      { id: 4, allocation: [0, 0, 2], max: [4, 3, 3] },
    ],
    totalResources: [10, 5, 7],
    resourceNames: ["A", "B", "C"],
  };

  const [state, setState] = useState<SystemState>(initialState);
  const [result, setResult] = useState<string>("");
  const [steps, setSteps] = useState<string[]>([]);

  // State for request
  const [requestProcess, setRequestProcess] = useState<number>(0);
  const [requestResources, setRequestResources] = useState<number[]>(
    initialState.resourceNames.map(() => 0)
  );

  const addProcess = () => {
    const newId = state.processes.length;
    const newProcess: Process = {
      id: newId,
      allocation: new Array(state.resourceNames.length).fill(0),
      max: new Array(state.resourceNames.length).fill(0),
    };
    setState({
      ...state,
      processes: [...state.processes, newProcess],
    });
  };

  const addResource = () => {
    const newName = String.fromCharCode(65 + state.resourceNames.length);
    setState({
      ...state,
      resourceNames: [...state.resourceNames, newName],
      totalResources: [...state.totalResources, 0],
      processes: state.processes.map((p) => ({
        ...p,
        allocation: [...p.allocation, 0],
        max: [...p.max, 0],
      })),
    });
  };

  const removeProcess = (processId: number) => {
    if (state.processes.length <= 1) return;
    const newProcesses = state.processes
      .filter((p) => p.id !== processId)
      .map((p, index) => ({ ...p, id: index }));
    setState({
      ...state,
      processes: newProcesses,
    });
  };

  const removeResource = (resourceIdx: number) => {
    if (state.resourceNames.length <= 1) return;
    setState({
      ...state,
      resourceNames: state.resourceNames.filter((_, i) => i !== resourceIdx),
      totalResources: state.totalResources.filter((_, i) => i !== resourceIdx),
      processes: state.processes.map((p) => ({
        ...p,
        allocation: p.allocation.filter((_, i) => i !== resourceIdx),
        max: p.max.filter((_, i) => i !== resourceIdx),
      })),
    });
  };

  const handleAllocationChange = (
    processId: number,
    resourceIdx: number,
    value: string
  ) => {
    const newProcesses = state.processes.map((p) => {
      if (p.id === processId) {
        const newAllocation = [...p.allocation];
        newAllocation[resourceIdx] = parseInt(value);
        return { ...p, allocation: newAllocation };
      }
      return p;
    });
    setState({ ...state, processes: newProcesses });
  };

  const handleMaxChange = (
    processId: number,
    resourceIdx: number,
    value: string
  ) => {
    const newProcesses = state.processes.map((p) => {
      if (p.id === processId) {
        const newMax = [...p.max];
        newMax[resourceIdx] = parseInt(value);
        return { ...p, max: newMax };
      }
      return p;
    });
    setState({ ...state, processes: newProcesses });
  };

  const handleTotalChange = (resourceIdx: number, value: string) => {
    const newTotal = [...state.totalResources];
    newTotal[resourceIdx] = parseInt(value);
    setState({ ...state, totalResources: newTotal });
  };

  const handleRequestChange = (resourceIdx: number, value: string) => {
    const newRequest = [...requestResources];
    newRequest[resourceIdx] = parseInt(value);
    setRequestResources(newRequest);
  };

  const runAlgorithm = () => {
    const executionResult = calculateBankersAlgorithm(state);
    setResult(
      `${executionResult.message}\n` +
        (executionResult.isSafe
          ? `Safe sequence: ${executionResult.safeSequence.join(" -> ")}`
          : "")
    );
    setSteps(
      executionResult.steps.map(
        (step) =>
          `Step ${step.step}: ${step.message}\n` +
          `Work: [${step.work.join(", ")}]\n` +
          `Finish: [${step.finish.map((f) => (f ? "T" : "F")).join(", ")}]`
      )
    );
  };

  const checkRequest = () => {
    const request = {
      processId: requestProcess,
      resources: requestResources,
    };
    const executionResult = checkResourceRequest(state, request);
    setResult(
      `${executionResult.message}\n` +
        (executionResult.isSafe
          ? `Safe sequence: ${executionResult.safeSequence.join(" -> ")}`
          : "")
    );
    setSteps(
      executionResult.steps.map(
        (step) =>
          `Step ${step.step}: ${step.message}\n` +
          `Work: [${step.work.join(", ")}]\n` +
          `Finish: [${step.finish.map((f) => (f ? "T" : "F")).join(", ")}]`
      )
    );
  };

  const available = calculateAvailable(state);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Banker's Algorithm</h1>

      <div className="mb-4 flex gap-4">
        <button
          onClick={addProcess}
          className="bg-green-500 text-white px-4 py-2 rounded">
          Add Process
        </button>
        <button
          onClick={addResource}
          className="bg-green-500 text-white px-4 py-2 rounded">
          Add Resource
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-xl mb-2">Total Resources</h2>
        <div className="flex flex-wrap gap-4">
          {state.resourceNames.map((res, i) => (
            <div key={i} className="flex items-center gap-2">
              <div>
                <label>{res}: </label>
                <input
                  type="number"
                  min="0"
                  value={state.totalResources[i]}
                  onChange={(e) => handleTotalChange(i, e.target.value)}
                  className="w-16 border p-1"
                />
              </div>
              <button
                onClick={() => removeResource(i)}
                className="text-red-600 px-2 py-1 rounded text-sm">
                <DeleteIcon />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Process Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse mb-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Process</th>
              <th className="border p-2">
                Allocation ({state.resourceNames.join(" ")})
              </th>
              <th className="border p-2">
                Max ({state.resourceNames.join(" ")})
              </th>
              <th className="border p-2">
                Available ({state.resourceNames.join(" ")})
              </th>
              <th className="border p-2">
                Need ({state.resourceNames.join(" ")})
              </th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.processes.map((process, rowIndex) => (
              <tr key={process.id}>
                <td className="border p-2">P{process.id}</td>
                <td className="border p-2">
                  {process.allocation.map((val, i) => (
                    <input
                      key={i}
                      type="number"
                      min="0"
                      value={val}
                      onChange={(e) =>
                        handleAllocationChange(process.id, i, e.target.value)
                      }
                      className="w-12 mx-1 border p-1"
                    />
                  ))}
                </td>
                <td className="border p-2">
                  {process.max.map((val, i) => (
                    <input
                      key={i}
                      type="number"
                      min="0"
                      value={val}
                      onChange={(e) =>
                        handleMaxChange(process.id, i, e.target.value)
                      }
                      className="w-12 mx-1 border p-1"
                    />
                  ))}
                </td>

                <td className="p-2 border">
                  {rowIndex === 0 &&
                    available.map((val, i) => (
                      <span key={i} className="mx-3">
                        {val}
                      </span>
                    ))}
                </td>

                <td className="border p-2">
                  {process.max.map((max, i) => (
                    <span key={i} className="mx-3">
                      {max - process.allocation[i]}
                    </span>
                  ))}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => removeProcess(process.id)}
                    className="text-red-500 px-2 py-1 rounded">
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={runAlgorithm}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">
        Run Algorithm
      </button>

      {/* Resource Request */}
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h2 className="text-xl mb-2">Resource Request</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="mr-2">Process:</label>
            <select
              value={requestProcess}
              onChange={(e) => setRequestProcess(parseInt(e.target.value))}
              className="border p-1">
              {state.processes.map((p) => (
                <option key={p.id} value={p.id}>
                  P{p.id}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-4">
            {state.resourceNames.map((res, i) => (
              <div key={i}>
                <label>{res}: </label>
                <input
                  type="number"
                  min="0"
                  value={requestResources[i]}
                  onChange={(e) => handleRequestChange(i, e.target.value)}
                  className="w-16 border p-1"
                />
              </div>
            ))}
          </div>
          <button
            onClick={checkRequest}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            Check Request
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-100 rounded">
            <h3 className="font-bold mb-2">Result</h3>
            <pre>{result}</pre>
          </div>
          <div className="p-4 bg-gray-100 rounded">
            <h3 className="font-bold mb-2">Execution Steps</h3>
            <pre>{steps.join("\n\n")}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
