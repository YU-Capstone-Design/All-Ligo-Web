import HomeMetricCard from "./HomeMetricCard";

const colorsByContentType = {
  POST: "#15C47E",
  VIDEO: "#FFD158",
};

const defaultContentTypeRatios = [
  { contentType: "POST", label: "블로그", ratio: 0 },
  { contentType: "VIDEO", label: "쇼츠", ratio: 0 },
];

const ContentTypeTrafficChart = ({ statistics }) => {
  const contentTypeRatios = statistics?.contentTypeRatios?.length
    ? statistics.contentTypeRatios
    : defaultContentTypeRatios;
  const normalizedRatios = contentTypeRatios.map((item) => ({
    contentType: item.contentType,
    label:
      item.contentType === "POST"
        ? "블로그"
        : item.contentType === "VIDEO"
          ? "쇼츠"
          : item.label,
    ratio: Number(item.ratio || 0),
    color: colorsByContentType[item.contentType] || "#CAD0D6",
  }));

  return (
    <HomeMetricCard title="콘텐츠 유형 별 유입 비율">
      <div className="pt-[4px]">
        <div className="flex h-[54px] overflow-hidden rounded-[16px] bg-[#E5E8EB]">
          {normalizedRatios.map((item) => (
            <div
              key={item.contentType}
              style={{
                width: `${item.ratio}%`,
                backgroundColor: item.color,
              }}
            />
          ))}
        </div>

        <div className="mt-[12px] flex items-start justify-between">
          {normalizedRatios.map((item, index) => (
            <div
              key={item.contentType}
              className={index === 1 ? "text-right" : ""}
            >
              <div className="flex items-center gap-[7px]">
                <span
                  className="h-[12px] w-[12px] rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[16px] leading-[24px] font-medium text-black">
                  {item.label}
                </span>
              </div>
              <span className="text-[14px] leading-[24px] text-[#62676D]">
                {item.ratio}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </HomeMetricCard>
  );
};

export default ContentTypeTrafficChart;
