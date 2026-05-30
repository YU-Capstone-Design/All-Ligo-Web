import arrowup from "../../assets/arrow-up.svg";

const ProductCard = ({ weekday, title, date }) => {
  return (
    <button
      type="button"
      className="flex p-[12px] w-full items-center rounded-[22px] bg-white px-[14px] text-left"
    >
      <div className="h-[76px] w-[76px] shrink-0 rounded-[5px] bg-[#E7F3FF]" />

      <div className="ml-[12px] flex min-w-0 flex-1 flex-col">
        <span className="text-[15px] font-normal leading-[14px] text-[#3182f6]">
          {weekday}
        </span>
        <span className="mt-[8px] truncate text-[20px] font-medium leading-[20px] text-black">
          {title}
        </span>
        <span className="mt-[8px] text-[14px] font-normal leading-[14px] text-[#7e858c]">
          {date}
        </span>
      </div>

      <img
        className="ml-[8px] h-[24px] w-[24px] shrink-0 rotate-180"
        src={arrowup}
        alt=""
      />
    </button>
  );
};

export default ProductCard;
