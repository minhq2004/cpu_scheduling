"use client";

import { useState } from "react";
import InputForm from "../components/InputForm";
import { Result } from "../components/Result";
import { Process, ScheduleResult } from "../algorithms/type";
import { FCFS } from "../algorithms/fcfs";
import { SJFN } from "../algorithms/sjfn";
import { SJFP } from "../algorithms/sjfp";
import { PN } from "@/algorithms/pn";
import { PP } from "@/algorithms/pp";
import { RR } from "@/algorithms/rr";

export default function Home() {
  const [schedule, setSchedule] = useState<ScheduleResult | null>(null);

  const handleSchedule = (
    processes: Process[],
    algorithm: string,
    quantum?: number,
    priorityType?: string
  ) => {
    let result: ScheduleResult;
    switch (algorithm) {
      case "FCFS":
        result = FCFS(processes);
        break;
      case "SJFN":
        result = SJFN(processes);
        break;
      case "SJFP":
        result = SJFP(processes);
        break;
      case "PriorityN":
        if (priorityType === undefined) {
          alert("Nhập tùy chọn ưu tiên");
          return;
        }
        result = PN(processes, priorityType);
        break;
      case "PriorityP":
        if (priorityType === undefined) {
          alert("Nhập tùy chọn ưu tiên");
          return;
        }
        result = PP(processes, priorityType);
        break;
      case "RR":
        if (quantum === undefined) {
          alert("Vui lòng nhập quantum!");
          return;
        }
        result = RR(processes, quantum);
        break;
      default:
        result = {
          ganttChart: [],
          processes: [],
          avg: {
            avgWaitingTime: 0,
            avgResponseTime: 0,
            avgTurnAroundTime: 0,
          },
        };
    }
    setSchedule(result);
  };

  return (
    <div className="h-full min-h-screen bg-white">
      <InputForm onSchedule={handleSchedule} />
      {schedule && <Result schedule={schedule} />}
    </div>
  );
}
