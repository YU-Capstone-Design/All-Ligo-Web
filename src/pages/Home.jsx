import { useNavigate } from "react-router-dom";
import { HiSparkles } from "react-icons/hi2";
import { IoNotifications } from "react-icons/io5";
import BottomNavigation from "../components/BottomNavigation";
import HourlyClickChart from "../components/home/HourlyClickChart";
import WeekdayClickChart from "../components/home/WeekdayClickChart";
import TagClickRatioChart from "../components/home/TagClickRatioChart";
import ContentTypeTrafficChart from "../components/home/ContentTypeTrafficChart";
import appname from "../assets/app-name.png";
import bell from "../assets/bell.png";
import mingcute from "../assets/mingcute.svg";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="no-scrollbar h-[100dvh] overflow-y-auto bg-[#F3F4F6] px-[17px] pb-[130px]">
      <header className="flex py-[7px] items-center justify-between">
       <img className="w-[88.685px] h-[24.383px]" src={appname} alt="All-Ligo" />
        <img  className="w-[28px] h-[28px] " src={bell} alt="알림" />
      </header>

      <main className="space-y-[18px] mt-[20px]">
        <button
          type="button"
          onClick={() => navigate("/makepage")}
          className="flex h-[59px] w-full items-center gap-[14px] rounded-[17px] bg-white px-[20px] text-left shadow-[0_8px_24px_rgba(0,0,0,0.05)]"
        >
          <img className="w-[36px] h-[36px]" src={mingcute} alt="콘텐츠 만들기" />
          <span className="text-[18px] leading-[24px] font-medium text-[#2272EB]">
            홍보 콘텐츠 만들러 가기
          </span>
        </button>

        <HourlyClickChart />
        <WeekdayClickChart />
        <TagClickRatioChart />
        <ContentTypeTrafficChart />
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Home;
