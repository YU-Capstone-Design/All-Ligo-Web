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
  "flex h-[63px] flex-1 basis-0 flex-col items-center justify-center gap-[8px] rounded-[10px] border px-[12px] py-[8px] text-center text-[16px] leading-[33px] outline-none cursor-pointer";

const WeekdaySelector = ({ selectedDays, onToggleDay }) => {
  const getDayStyle = (day, colorClass = "text-[#000000]") => {
    const isSelected = selectedDays.includes(day);

    return `
      ${baseDayStyle}
      ${colorClass}
      ${
        isSelected
          ? "border-[#3182F6] bg-[#C9E2FF]"
          : "border-[#F6F6F8] bg-[#F6F6F8]"
      }
    `;
  };

  return (
    <div className="flex gap-[8px]">
      {days.map((day) => (
        <button
          key={day.label}
          type="button"
          onClick={() => onToggleDay(day.label)}
          className={getDayStyle(day.label, day.colorClass)}
        >
          {day.label}
        </button>
      ))}
    </div>
  );
};

export default WeekdaySelector;
