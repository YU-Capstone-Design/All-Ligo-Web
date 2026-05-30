import HomeMetricCard from "./HomeMetricCard";

const ContentTypeTrafficChart = () => {
  return (
    <HomeMetricCard title="콘텐츠 유형 별 유입 비율">
      <div className="pt-[4px]">
        <div className="flex h-[54px] overflow-hidden rounded-[16px] bg-[#FFD158]">
          <div className="w-[64%] rounded-r-none bg-[#15C47E]" />
        </div>

        <div className="mt-[12px] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-[7px]">
              <span className="h-[12px] w-[12px] rounded-full bg-[#15C47E]" />
              <span className="text-[16px] leading-[24px] font-medium text-black">
                블로그
              </span>
            </div>
            <span className="text-[14px] leading-[24px] text-[#62676D]">
              64%
            </span>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-[7px]">
              <span className="h-[10px] w-[10px] rounded-full bg-[#FFD158]" />
              <span className="text-[16px] leading-[24px] font-medium text-black">
                인스타그램
              </span>
            </div>
            <span className="text-[14px] leading-[24px] text-[#62676D]">
              36%
            </span>
          </div>
        </div>
      </div>
    </HomeMetricCard>
  );
};

export default ContentTypeTrafficChart;
