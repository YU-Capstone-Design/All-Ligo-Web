import HomeMetricCard from "./HomeMetricCard";

const tagColors = ["#FFD158", "#15C47E", "#B44BD7"];

const buildConicGradient = (tags) => {
  if (!tags.length) return "#E5E8EB";

  let currentDegree = 0;
  const gradientStops = tags.map((tag) => {
    const nextDegree = currentDegree + (Number(tag.ratio || 0) / 100) * 360;
    const stop = `${tag.color} ${currentDegree}deg ${nextDegree}deg`;
    currentDegree = nextDegree;
    return stop;
  });

  if (currentDegree < 360) {
    gradientStops.push(`#E5E8EB ${currentDegree}deg 360deg`);
  }

  return `conic-gradient(${gradientStops.join(", ")})`;
};

const TagClickRatioChart = ({ statistics }) => {
  const tags = (statistics?.topTagClickRatios || []).map((tag, index) => ({
    label: tag.tagName,
    ratio: Number(tag.ratio || 0),
    color: tagColors[index % tagColors.length],
  }));

  return (
    <HomeMetricCard title="태그 별 클릭 비율">
      <div className="flex h-[140px] items-center gap-[26px]">
        <div
          className="flex h-[140px] w-[140px] shrink-0 items-center justify-center rounded-full"
          style={{
            background: buildConicGradient(tags),
          }}
        >
          <div className="h-[94px] w-[94px] rounded-full bg-white" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-[12px]">
          {tags.length === 0 && (
            <p className="text-[14px] font-medium text-[#7E858C]">
              태그 클릭 데이터가 없습니다.
            </p>
          )}

          {tags.map((tag) => (
            <div key={tag.label} className="flex items-center gap-[8px]">
              <span
                className="h-[18px] w-[18px] shrink-0 rounded-[4px]"
                style={{ backgroundColor: tag.color }}
              />
              <span className="w-[42px] text-[18px] leading-[24px] font-bold text-black">
                {tag.ratio}%
              </span>
              <span className="min-w-0 truncate text-[18px] leading-[24px] text-[#62676D]">
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
