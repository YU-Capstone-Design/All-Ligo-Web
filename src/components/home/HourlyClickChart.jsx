import HomeMetricCard from "./HomeMetricCard";

const chartWidth = 288;
const chartHeight = 130;
const plotTop = 14;
const plotBottom = 94;
const plotLeft = 16;
const plotRight = 272;

const averageLabelWidth = 32;
const averageLabelHeight = 20;

const defaultHourlyClicks = Array.from({ length: 24 }, (_, hour) => ({
  hour,
  clickCount: 0,
}));

const HourlyClickChart = ({ statistics }) => {
  const hourlyClicks = statistics?.hourlyClicks?.length
    ? statistics.hourlyClicks
    : defaultHourlyClicks;
  const points = hourlyClicks
    .map(({ hour, clickCount }) => [Number(hour), Number(clickCount || 0)])
    .sort((a, b) => a[0] - b[0]);
  const maxClickCount = Math.max(
    statistics?.maxClickCount || 0,
    ...points.map((point) => point[1]),
    1
  );
  const yMax = Math.ceil(maxClickCount * 1.2);
  const averageClickCount = Number(statistics?.averageClickCount || 0);
  const xScale = (hour) => plotLeft + (hour / 24) * (plotRight - plotLeft);
  const yScale = (value) =>
    plotBottom - (value / yMax) * (plotBottom - plotTop);
  const averageY = yScale(averageClickCount);
  const averageLabelX = plotLeft - averageLabelWidth / 2;
  const averageLabelY = averageY - averageLabelHeight + 6;
  const linePath = points
    .map(([hour, value], index) => {
      const command = index === 0 ? "M" : "L";
      return `${command} ${xScale(hour)} ${yScale(value)}`;
    })
    .join(" ");
  const minPoint = points.reduce((min, point) =>
    point[1] < min[1] ? point : min
  );
  const maxPoint = points.reduce((max, point) =>
    point[1] > max[1] ? point : max
  );

  const maxLabelX = Math.max(plotLeft + 40, xScale(maxPoint[0]) - 10);
  const minLabelX = Math.min(plotRight - 40, xScale(minPoint[0]) + 8);

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
          y1={averageY}
          y2={averageY}
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
        <circle
          cx={xScale(minPoint[0])}
          cy={yScale(minPoint[1])}
          r="3.5"
          fill="#FF4A68"
        />
        <circle
          cx={xScale(maxPoint[0])}
          cy={yScale(maxPoint[1])}
          r="3.5"
          fill="#FF4A68"
        />
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
          x={maxLabelX}
          y={Math.max(12, yScale(maxPoint[1]) - 4)}
          textAnchor="end"
          className="fill-[#FF0929] text-[12px] font-medium"
        >
          최고 {maxPoint[1]}
        </text>
        <text
          x={minLabelX}
          y={Math.min(104, yScale(minPoint[1]) + 20)}
          className="fill-[#FF0929] text-[12px] font-medium"
        >
          최저 {minPoint[1]}
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
