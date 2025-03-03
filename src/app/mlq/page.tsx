"use client";

import { useState } from "react";
import MultiLevelInputForm from "@/components/MultiLevelInputForm";
import { Result } from "@/components/Result";
import { Process, ScheduleResult, Queue } from "@/algorithms/type";
import { MLQ } from "@/algorithms/mlq";

export default function MLQPage() {
  const [schedule, setSchedule] = useState<ScheduleResult | null>(null);

  const handleSchedule = (queues: Queue[]) => {
    const result = MLQ(queues);
    setSchedule(result);
  };

  return (
    <div className="h-full min-h-screen bg-white">
      <MultiLevelInputForm onQueueChange={handleSchedule} />
      {schedule && <Result schedule={schedule} />}
    </div>
  );
}
