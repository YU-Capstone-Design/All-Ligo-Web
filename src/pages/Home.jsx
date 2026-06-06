import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation";
import HourlyClickChart from "../components/home/HourlyClickChart";
import WeekdayClickChart from "../components/home/WeekdayClickChart";
import TagClickRatioChart from "../components/home/TagClickRatioChart";
import ContentTypeTrafficChart from "../components/home/ContentTypeTrafficChart";
import { getDashboardStatistics } from "../apis/DashboardApi";
import appname from "../assets/app-name.png";
import bell from "../assets/bell.png";
import mingcute from "../assets/mingcute.svg";

const Home = () => {
  const navigate = useNavigate();
  const [dashboardStatistics, setDashboardStatistics] = useState(null);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboardStatistics = async () => {
      try {
        setIsDashboardLoading(true);
        setDashboardError("");
        const statistics = await getDashboardStatistics();

        if (isMounted) {
          setDashboardStatistics(statistics);
        }
      } catch (error) {
        if (isMounted) {
          setDashboardError(
            error.response?.data?.message ||
              "대시보드 통계를 불러오지 못했어요."
          );
        }
      } finally {
        if (isMounted) {
          setIsDashboardLoading(false);
        }
      }
    };

    loadDashboardStatistics();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="no-scrollbar h-[100dvh] overflow-y-auto bg-[#F3F4F6] px-[17px] pb-[130px]">
      <header className="flex py-[7px] items-center justify-between">
        <img
          className="w-[88.685px] h-[24.383px]"
          src={appname}
          alt="All-Ligo"
        />
        <button
          type="button"
          onClick={() => navigate("/notifications")}
          aria-label="알림"
        >
          <img className="w-[28px] h-[28px]" src={bell} alt="" />
        </button>
      </header>

      <main className="space-y-[18px] mt-[20px]">
        <button
          type="button"
          onClick={() => navigate("/makepage")}
          className="flex h-[59px] w-full items-center gap-[14px] rounded-[17px] bg-white px-[20px] text-left shadow-[0_8px_24px_rgba(0,0,0,0.05)]"
        >
          <img
            className="w-[36px] h-[36px]"
            src={mingcute}
            alt="콘텐츠 만들기"
          />
          <span className="text-[18px] leading-[24px] font-medium text-[#2272EB]">
            홍보 콘텐츠 만들러 가기
          </span>
        </button>

        <section className="rounded-[20px] bg-white px-[20px] py-[16px]">
          <p className="text-[14px] font-medium leading-[20px] text-[#7E858C]">
            이번 달 전체 클릭 수
          </p>
          <p className="mt-[2px] text-[28px] font-bold leading-[36px] text-[#2272EB]">
            {(dashboardStatistics?.totalClicks || 0).toLocaleString()}
          </p>
        </section>

        {dashboardError && (
          <p className="rounded-[16px] bg-white px-[16px] py-[14px] text-[14px] font-medium text-[#DF0024]">
            {dashboardError}
          </p>
        )}

        {isDashboardLoading && (
          <p className="rounded-[16px] bg-white px-[16px] py-[14px] text-center text-[14px] font-medium text-[#7E858C]">
            대시보드 통계를 불러오는 중입니다.
          </p>
        )}

        <HourlyClickChart
          statistics={dashboardStatistics?.hourlyClickStatistics}
        />
        <WeekdayClickChart
          statistics={dashboardStatistics?.dayOfWeekClickStatistics}
        />
        <TagClickRatioChart
          statistics={dashboardStatistics?.tagClickStatistics}
        />
        <ContentTypeTrafficChart
          statistics={dashboardStatistics?.contentTypeClickStatistics}
        />
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Home;
