import HomeMetricCard from "./HomeMetricCard";

const points = [
  [0, 54],
  [2, 32],
  [4, 25],
  [6, 27],
  [8, 40],
  [10, 49],
  [12, 55],
  [14, 69],
  [16, 79],
  [18, 82],
  [20, 114],
  [22, 96],
  [24, 64],
];

const chartWidth = 288;
const chartHeight = 130;
const plotTop = 14;
const plotBottom = 94;
const plotLeft = 16;
const plotRight = 272;

const xScale = (hour) => plotLeft + (hour / 24) * (plotRight - plotLeft);
const yScale = (value) => plotBottom - (value / 130) * (plotBottom - plotTop);
const averageLabelWidth = 32;
const averageLabelHeight = 20;
const [firstHour, firstValue] = points[0];
const averageLabelX = xScale(firstHour) - averageLabelWidth / 2;
const averageLabelY = yScale(firstValue) - averageLabelHeight + 6;

const linePath = points
  .map(([hour, value], index) => {
    const command = index === 0 ? "M" : "L";
    return `${command} ${xScale(hour)} ${yScale(value)}`;
  })
  .join(" ");

const HourlyClickChart = () => {
  const minPoint = points.reduce((min, point) => (point[1] < min[1] ? point : min));
  const maxPoint = points.reduce((max, point) => (point[1] > max[1] ? point : max));

  return (
    <HomeMetricCard title="시간대 별 클릭 수">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="h-[130px] w-full"
        role="img"
        aria-label="시간대 별 클릭 수 그래프"
      >
        <line
          x1={plotLeft}
          x2={plotRight}
          y1={64}
          y2={64}
          stroke="#62676D"
          strokeDasharray="4 4"
        />
        <path
          d={linePath}
          fill="none"
          stroke="#FF0929"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
        <circle cx={xScale(minPoint[0])} cy={yScale(minPoint[1])} r="3.5" fill="#FF4A68" />
        <circle cx={xScale(maxPoint[0])} cy={yScale(maxPoint[1])} r="3.5" fill="#FF4A68" />
        <foreignObject
          x={averageLabelX}
          y={averageLabelY}
          width={averageLabelWidth}
          height={averageLabelHeight}
        >
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            className="flex h-full w-full items-center justify-center"
            style={{
              color: "var(--coolgray-600, #62676D)",
              textAlign: "center",
              fontFamily: '"Apple SD Gothic Neo"',
              fontSize: "10px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "12px",
              letterSpacing: "-0.32px",
              borderRadius: "16px",
              border: "0.5px solid var(--coolgray-600, #62676D)",
              background: "rgba(255, 255, 255, 0.65)",
              backdropFilter: "blur(1px)",
            }}
          >
            평균
          </div>
        </foreignObject>
        <text
          x={xScale(maxPoint[0]) - 10}
          y={yScale(maxPoint[1]) }
          textAnchor="end"
          className="fill-[#FF0929] text-[12px] font-medium"
        >
          최고 114
        </text>
        <text
          x={xScale(minPoint[0]) + 8}
          y={yScale(minPoint[1]) + 20}
          className="fill-[#FF0929] text-[12px] font-medium"
        >
          최저 12
        </text>
        {[0, 4, 8, 12, 16, 20, 24].map((hour) => (
          <text
            key={hour}
            x={xScale(hour)}
            y="122"
            textAnchor="middle"
            className="fill-[#62676D] text-[12px]"
          >
            {hour}
          </text>
        ))}
      </svg>
    </HomeMetricCard>
  );
};

export default HourlyClickChart;
