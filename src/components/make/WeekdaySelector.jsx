const days = [
  { label: "월" },
  { label: "화" },
  { label: "수" },
  { label: "목" },
  { label: "금" },
  { label: "토", colorClass: "text-[#3182f6]" },
  { label: "일", colorClass: "text-[#ed0404]" },
];

const baseDayStyle =
  "h-[63px] px-[12px] py-[8px] border rounded-[10px] text-center justify-center items-center flex text-[16px] leading-[33px] outline-none w-full cursor-pointer";

const WeekdaySelector = ({ selectedDay, onSelectDay }) => {
  const getDayStyle = (day, colorClass = "text-[#000000]") => {
    const isSelected = selectedDay === day;

    return `
      ${baseDayStyle}
      ${colorClass}
      ${
        isSelected
          ? "border-[#3182F6] bg-[#C9E2FF]"
          : "border-white bg-white"
      }
    `;
  };

  return (
    <div className="flex gap-[8px]">
      {days.map((day) => (
        <button
          key={day.label}
          type="button"
          onClick={() => onSelectDay(day.label)}
          className={getDayStyle(day.label, day.colorClass)}
        >
          {day.label}
        </button>
      ))}
    </div>
  );
};

export default WeekdaySelector;
