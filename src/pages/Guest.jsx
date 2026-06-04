import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronDown } from "react-icons/io5";
import locationIcon from "../assets/location.svg";
import mapPinIcon from "../assets/map-pin.svg";
import fireIcon from "../assets/fire.svg";

const categories = ["전체", "식사", "카페", "빵집", "기타"];

const stores = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  distance: "500m",
  name: "덤브 치킨 영남대점",
  description: "[빠삭함에 홀려 촉촉함을 느끼는] 반반...",
  couponCount: 5,
}));

const GuestStoreCard = ({ store, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[130px] w-full overflow-hidden rounded-[20px] bg-white text-left"
    >
      <div className="h-full w-[36%] shrink-0 bg-[#DFE4EA]" />

      <div className="flex min-w-0 flex-1 flex-col justify-center pr-[12px] pl-[14px]">
        <div className="flex items-center text-[14px] font-normal leading-[14px] tracking-[-0.5px] text-[#424950]">
          <img className="mr-[4px] h-[16px] w-[16px]" src={mapPinIcon} alt="" />
          <span>내 위치에서&nbsp;</span>
          <span className="font-normal text-[#3182F6]">{store.distance}</span>
        </div>

        <div className="mt-[8px] min-w-0">
          <h2 className="truncate text-[20px] font-medium leading-[24px] tracking-[-0.5px] text-black">
            {store.name}
          </h2>
          <p className="mt-[8px] truncate text-[14px] font-normal leading-[14px] tracking-[-0.5px] text-[#7E858C]">
            {store.description}
          </p>
        </div>

        <div className="mt-[12px] flex items-center overflow-hidden text-[14px] font-normal leading-[14px] tracking-[-0.5px] text-[#424950]">
          <span className="truncate">사용할 수 있는 쿠폰&nbsp;</span>
          <span className="line-clamp-1 overflow-hidden text-ellipsis text-[14px] font-bold leading-[14px] tracking-[-0.5px] text-[#E42A2A]">
            {store.couponCount}개
          </span>
          <img className="ml-[4px] h-[24px] w-[24px]" src={fireIcon} alt="" />
        </div>
      </div>
    </button>
  );
};

const Guest = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setIsCategoryOpen(false);
  };

  return (
    <div className="no-scrollbar h-[100dvh] overflow-y-auto bg-[#F6F6F8] px-[20px] pb-[24px] pt-[31px]">
      <header className="flex items-center gap-[14px]">
        <img className="h-[42px] w-[42px] shrink-0" src={locationIcon} alt="" />
        <h1 className="text-[20px] font-bold leading-[24px] tracking-[-0.5px] text-black">
          근처 할인쿠폰이 있는 가게에요!
        </h1>
      </header>

      <div className="relative mt-[18px] flex justify-end">
        <button
          type="button"
          onClick={() => setIsCategoryOpen((isOpen) => !isOpen)}
          className={`flex h-[45px] w-[80px] items-center justify-center gap-[4px] border border-[#E9E9EC] px-[8px] text-[16px] font-normal leading-[31px] text-[#62676D] ${
            isCategoryOpen
              ? "rounded-[16px] bg-transparent shadow-none"
              : "rounded-[45.652px] bg-white shadow-[0_0_12px_rgba(0,0,0,0.04)]"
          }`}
          aria-expanded={isCategoryOpen}
        >
          {selectedCategory}
          <IoChevronDown
            className={`text-[18px] transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isCategoryOpen && (
          <div className="absolute right-0 top-0 z-20 flex w-[80px] flex-col items-center gap-[4px] overflow-hidden rounded-[16px] border border-[#E9E9EC] bg-white/70 px-[8px] py-[4px] text-[16px] font-normal leading-[31px] text-[#62676D] shadow-[0_0_12px_rgba(0,0,0,0.15)] backdrop-blur-[4px]">
            {categories.map((category, index) => (
              <div key={category} className="flex w-full flex-col items-center">
                <button
                  type="button"
                  onClick={() => handleCategoryClick(category)}
                  className="flex h-[31px] w-full items-center justify-center whitespace-nowrap"
                >
                  {category}
                  {index === 0 && (
                    <IoChevronDown className="ml-[4px] text-[18px]" />
                  )}
                </button>

                {index < categories.length - 1 && (
                  <div className="h-px w-full bg-[#E2E7ED]" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <main className="mt-[16px] flex flex-col gap-[14px]">
        {stores.map((store) => (
          <GuestStoreCard
            key={store.id}
            store={store}
            onClick={() => navigate("/guest/coupons")}
          />
        ))}
      </main>
    </div>
  );
};

export default Guest;
