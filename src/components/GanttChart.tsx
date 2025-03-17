import React from "react";

interface GanttChartProps {
  ganttChart: { process: number; start: number; end: number }[];
}

const GanttChart: React.FC<GanttChartProps> = ({ ganttChart }) => {
  if (ganttChart.length === 0) return null;

  // Tìm khoảng thời gian nhỏ nhất và lớn nhất
  const minTime = Math.min(...ganttChart.map((item) => item.start));
  const maxTime = Math.max(...ganttChart.map((item) => item.end));
  const totalDuration = maxTime - minTime;

  const fullChart: { process: number | null; start: number; end: number }[] =
    [];

  for (let i = 0; i < ganttChart.length; i++) {
    if (i > 0 && ganttChart[i].start > ganttChart[i - 1].end) {
      // Chèn khoảng trống nếu có thời gian chờ giữa hai tiến trình
      fullChart.push({
        process: null,
        start: ganttChart[i - 1].end,
        end: ganttChart[i].start,
      });
    }
    fullChart.push(ganttChart[i]);
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Thanh Gantt Chart */}
      <div className="relative flex items-center py-4 min-w-3xl ml-2">
        {fullChart.map((item, index) => {
          const widthPercentage =
            ((item.end - item.start) / totalDuration) * 100;

          return (
            <div
              key={index}
              className={`relative flex justify-center items-center text-white font-bold border-l-2 border-gray-700 ${
                item.process === null ? "bg-gray-300 h-full" : ""
              }`}
              style={{
                width: `${widthPercentage}%`,
                backgroundColor:
                  item.process === null
                    ? "transparent"
                    : `hsl(${item.process * 50}, 70%, 50%`,
              }}
            >
              {item.process !== null ? `P${item.process}` : ""}
              {/* Mốc thời gian dưới mỗi ô */}
              <span className="absolute bottom-[-20px] -left-1 text-gray-800 text-sm">
                {item.start}
              </span>
            </div>
          );
        })}
        {/* Mốc thời gian cuối cùng */}
        <span className="absolute -right-1 -bottom-1 text-gray-800 text-sm font-bold">
          {maxTime}
        </span>
      </div>
    </div>
  );
};

export default GanttChart;
