import HomeMetricCard from "./HomeMetricCard";

const data = [
  { label: "월", value: 72 },
  { label: "화", value: 45 },
  { label: "수", value: 164, active: true },
  { label: "목", value: 136 },
  { label: "금", value: 70 },
  { label: "토", value: 102 },
  { label: "일", value: 120 },
];

const WeekdayClickChart = () => {
  const maxValue = 180;

  return (
    <HomeMetricCard title="요일 별 클릭 수">
      <div className="relative h-[150px]">
        <div className="absolute inset-x-0 top-[10px] bottom-[24px]">
          {[160, 120, 80, 40, 0].map((value) => (
            <div
              key={value}
              className="absolute left-0 right-0 flex items-center"
              style={{
                top: value === 0 ? "calc(100% - 8px)" : `${((160 - value) / 160) * 100}%`,
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
            const height = Math.max(22, (item.value / maxValue) * 105);

            return (
              <div key={item.label} className="relative flex w-[31px] justify-center">
                {item.active && (
                  <div className="absolute bottom-[calc(100%+14px)] flex items-center text-center justify-center gap-[10px] rounded-[8px] bg-[#478FF5] px-[8px] pt-[5px] pb-[3px] text-[14px] leading-none font-medium text-white after:absolute after:left-1/2 after:top-full after:h-0 after:w-0 after:-translate-x-1/2 after:border-x-[8px] after:border-t-[9px] after:border-x-transparent after:border-t-[#478FF5]">
                    <span className="-translate-y-[2px]">{item.value}</span>
                  </div>
                )}
                <div
                  className={`w-[31px] rounded-t-[10px] ${
                    item.active ? "bg-[#3182F6]" : "bg-[#C9E2FF]"
                  }`}
                  style={{ height }}
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
