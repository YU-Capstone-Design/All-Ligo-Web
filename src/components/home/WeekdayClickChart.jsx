import HomeMetricCard from "./HomeMetricCard";

const defaultDayOfWeekClicks = [
  { dayOfWeek: "MON", label: "월", clickCount: 0, rank: 3 },
  { dayOfWeek: "TUE", label: "화", clickCount: 0, rank: 3 },
  { dayOfWeek: "WED", label: "수", clickCount: 0, rank: 3 },
  { dayOfWeek: "THU", label: "목", clickCount: 0, rank: 3 },
  { dayOfWeek: "FRI", label: "금", clickCount: 0, rank: 3 },
  { dayOfWeek: "SAT", label: "토", clickCount: 0, rank: 3 },
  { dayOfWeek: "SUN", label: "일", clickCount: 0, rank: 3 },
];

const getBarColor = (rank) => {
  if (rank === 1) return "#3182F6";
  if (rank === 2) return "#8BC5FF";
  return "#C9E2FF";
};

const WeekdayClickChart = ({ statistics }) => {
  const data = statistics?.dayOfWeekClicks?.length
    ? statistics.dayOfWeekClicks
    : defaultDayOfWeekClicks;
  const maxClickCount = Math.max(
    statistics?.maxClickCount || 0,
    ...data.map((item) => Number(item.clickCount || 0)),
    1
  );
  const gridMax = Math.ceil(maxClickCount / 40) * 40 || 40;
  const maxValue = gridMax * 1.1;
  const gridValues = Array.from({ length: 5 }, (_, index) =>
    Math.round((gridMax / 4) * (4 - index))
  );

  return (
    <HomeMetricCard title="요일 별 클릭 수">
      <div className="relative h-[150px]">
        <div className="absolute inset-x-0 top-[10px] bottom-[24px]">
          {gridValues.map((value) => (
            <div
              key={value}
              className="absolute left-0 right-0 flex items-center"
              style={{
                top:
                  value === 0
                    ? "calc(100% - 8px)"
                    : `${((gridMax - value) / gridMax) * 100}%`,
                transform: value === 0 ? "none" : "translateY(-50%)",
              }}
            >
              <div className="flex-1 bg-[#CAD0D6]" style={{ height: "0.3px" }} />
              <span className="ml-[8px] w-[20px] text-right text-[10px] text-[#62676D]">
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className="absolute bottom-[24px] left-0 right-[28px] flex h-[105px] items-end justify-between">
          {data.map((item) => {
            const value = Number(item.clickCount || 0);
            const rank = Number(item.rank || 3);
            const height = value === 0 ? 4 : Math.max(22, (value / maxValue) * 105);

            return (
              <div key={item.label} className="relative flex w-[31px] justify-center">
                {rank === 1 && (
                  <div className="absolute bottom-[calc(100%+14px)] flex items-center text-center justify-center gap-[10px] rounded-[8px] bg-[#478FF5] px-[8px] pt-[5px] pb-[3px] text-[14px] leading-none font-medium text-white after:absolute after:left-1/2 after:top-full after:h-0 after:w-0 after:-translate-x-1/2 after:border-x-[8px] after:border-t-[9px] after:border-x-transparent after:border-t-[#478FF5]">
                    <span className="-translate-y-[2px]">{value}</span>
                  </div>
                )}
                <div
                  className="w-[31px] rounded-t-[10px]"
                  style={{ height, backgroundColor: getBarColor(rank) }}
                />
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-0 left-0 right-[28px] flex justify-between">
          {data.map((item) => (
            <span key={item.label} className="w-[31px] text-center text-[12px] text-[#62676D]">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </HomeMetricCard>
  );
};

export default WeekdayClickChart;
