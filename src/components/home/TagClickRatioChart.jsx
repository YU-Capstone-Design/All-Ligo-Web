import HomeMetricCard from "./HomeMetricCard";

const tags = [
  { label: "키워드1", value: "65%", color: "#FFD158" },
  { label: "키워드2", value: "46%", color: "#15C47E" },
  { label: "키워드3", value: "20%", color: "#B44BD7" },
];

const TagClickRatioChart = () => {
  return (
    <HomeMetricCard title="태그 별 클릭 비율">
      <div className="flex h-[140px] items-center gap-[26px]">
        <div
          className="flex h-[140px] w-[140px] shrink-0 items-center justify-center rounded-full"
          style={{
            background:
              "conic-gradient(#B44BD7 0deg 56deg, #15C47E 56deg 154deg, #FFD158 154deg 360deg)",
          }}
        >
          <div className="h-[94px] w-[94px] rounded-full bg-white" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-[12px]">
          {tags.map((tag) => (
            <div key={tag.label} className="flex items-center gap-[8px]">
              <span
                className="h-[18px] w-[18px] shrink-0 rounded-[4px]"
                style={{ backgroundColor: tag.color }}
              />
              <span className="w-[42px] text-[18px] leading-[24px] font-bold text-black">
                {tag.value}
              </span>
              <span className="text-[18px] leading-[24px] text-[#62676D]">
                {tag.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </HomeMetricCard>
  );
};

export default TagClickRatioChart;
