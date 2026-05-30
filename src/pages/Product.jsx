import { useNavigate } from "react-router-dom";
import { IoAdd } from "react-icons/io5";
import BottomNavigation from "../components/BottomNavigation";
import ProductCard from "../components/product/ProductCard";
import appname from "../assets/app-name.png";
import bell from "../assets/bell.png";
import calendar from "../assets/calendar.svg";

const productItems = [
  {
    id: 1,
    weekday: "화요일",
    title: "우리가게 레몬에이드 광고",
    date: "2026. 05. 02. 금",
  },
  {
    id: 2,
    weekday: "화요일",
    title: "우리가게 레몬에이드 광고",
    date: "2026. 05. 02. 금",
  },
  {
    id: 3,
    weekday: "화요일",
    title: "우리가게 레몬에이드 광고",
    date: "2026. 05. 02. 금",
  },
];

const Product = () => {
  const navigate = useNavigate();

  return (
    <div className="no-scrollbar h-[100dvh] overflow-y-auto bg-[#F3F4F6] px-[22px] pb-[130px]">
      <header className="flex items-center justify-between py-[7px]">
        <img className="h-[24.383px] w-[88.685px]" src={appname} alt="All-Ligo" />
        <img className="h-[28px] w-[28px]" src={bell} alt="알림" />
      </header>

      <main className="mt-[46px]">
        <section className="flex h-[42px] items-center gap-[4px]">
          <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center">
            <img
              className="h-[42px] w-[42px]"
              src={calendar}
              alt="캘린더"
            />
          </div>

          <span className="flex h-[42px] items-center text-[20px] font-semibold leading-none text-black">
            등록된 홍보페이지가{" "}
            <span className="font-bold text-[#3182F6]">&nbsp;12개</span> &nbsp;있어요!
          </span>
        </section>

        <div className="mt-[4.5px] flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/makepage")}
            className="flex h-[45px] items-center gap-[8px] rounded-[555px] bg-white pl-[19.5px] pr-[18.68px] text-[16px] font-medium text-black leading-[20px]"
          >
            추가 등록
            <IoAdd className="text-[25px] text-[#2880EB]" />
          </button>
        </div>

        <section className="mt-[14px] space-y-[14px]">
          {productItems.map((item) => (
            <ProductCard
              key={item.id}
              weekday={item.weekday}
              title={item.title}
              date={item.date}
            />
          ))}
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Product;
