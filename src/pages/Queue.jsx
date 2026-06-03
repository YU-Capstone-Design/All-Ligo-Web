import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronForward } from "react-icons/io5";
import BottomNavigation from "../components/BottomNavigation";
import appname from "../assets/app-name.png";
import bell from "../assets/bell.png";
import todayStatusIcon from "../assets/queue/check.png";
import statusCompleteIcon from "../assets/queue/finish.png";
import statusProgressIcon from "../assets/queue/ing.png";
import statusWaitingIcon from "../assets/queue/wait.png";
import { getPromotionScheduleQueue } from "../apis/PromotionApi";

const statusStyles = {
  ready: {
    wrapper: "bg-[#D0E2D5] text-[#424950]",
    icon: statusCompleteIcon,
    typeBadge: "bg-[#F6F6F8] text-[#424950]",
    title: "text-[#000000]",
    arrow: "text-[#D3DAE2]",
  },
  progress: {
    wrapper: "bg-[#E8F3FF] text-[#424950]",
    icon: statusProgressIcon,
    typeBadge: "bg-[#F6F6F8]/60 text-[#9DA4AB]",
    title: "text-[#B4BAC0]",
    arrow: "text-[#EDF1F5]",
  },
  waiting: {
    wrapper: "bg-[#E2E7ED] text-[#424950]",
    icon: statusWaitingIcon,
    typeBadge: "bg-[#F6F6F8]/60 text-[#9DA4AB]",
    title: "text-[#B4BAC0]",
    arrow: "text-[#EDF1F5]",
  },
  failed: {
    wrapper: "bg-[#FFE8E8] text-[#ED0404]",
    icon: statusWaitingIcon,
    typeBadge: "bg-[#F6F6F8]/60 text-[#9DA4AB]",
    title: "text-[#B4BAC0]",
    arrow: "text-[#EDF1F5]",
  },
};

const QueueCard = ({ item, onClick }) => {
  const styles = statusStyles[item.tone];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!item.clickable}
      className="flex h-[90px] w-full items-center rounded-[18px] bg-white px-[18px] text-left shadow-[0_10px_24px_rgba(30,42,58,0.03)] disabled:cursor-default"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-[8px]">
          <span
            className={`inline-flex h-[22px] items-center gap-[4px] rounded-full px-[8px] text-[12px] font-semibold ${styles.wrapper}`}
          >
            <img
              className="h-[16px] w-[16px] object-contain"
              src={styles.icon}
              alt=""
            />
            {item.status}
          </span>
          <span
            className={`rounded-full px-[10px] py-[3px] text-[12px] font-medium ${styles.typeBadge}`}
          >
            {item.type}
          </span>
        </div>
        <p
          className={`mt-[10px] truncate text-[20px] font-medium ${styles.title}`}
        >
          {item.title}
        </p>
      </div>
      <IoChevronForward className={`ml-[12px] text-[24px] ${styles.arrow}`} />
    </button>
  );
};

const getQueueTone = (status) => {
  if (status === "SUCCESS") return "ready";
  if (status === "PROCESSING") return "progress";
  if (status === "FAILED") return "failed";

  return "waiting";
};

const toQueueItem = (item) => ({
  id: item.executionId,
  promotionId: item.promotionId,
  contentId: item.contentId,
  status: item.statusLabel || item.status,
  statusCode: item.status,
  type: item.contentTypeLabel || item.contentType,
  contentType: item.contentType,
  title: item.promotionTitle || "게시글 제목",
  tone: getQueueTone(item.status),
  executedAt: item.executedAt,
  clickable: !!item.clickable,
});

const Queue = () => {
  const navigate = useNavigate();
  const [queueItems, setQueueItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const todayLabel = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await getPromotionScheduleQueue();
        setQueueItems(Array.isArray(response) ? response.map(toQueueItem) : []);
      } catch (error) {
        setErrorMessage(
          error.response?.status === 401
            ? "로그인이 만료되었어요. 다시 로그인 후 확인해주세요."
            : error.response?.data?.message ||
                "스케줄링 대기열을 불러오지 못했어요.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchQueue();
  }, []);

  const scheduledCount = queueItems.filter((item) =>
    ["progress", "waiting"].includes(item.tone),
  ).length;

  return (
    <div className="no-scrollbar h-[100dvh] overflow-y-auto bg-[#F5F6F8] px-[16px] pb-[128px] pt-[18px]">
      <header className="flex items-center justify-between">
        <img
          className="h-[25px] w-[95px] object-contain"
          src={appname}
          alt="All-Ligo"
        />
        <button
          type="button"
          onClick={() => navigate("/notifications")}
          className="flex h-[40px] w-[40px] items-center justify-center"
          aria-label="알림"
        >
          <img
            className="h-[28px] w-[28px] object-contain opacity-70"
            src={bell}
            alt=""
          />
        </button>
      </header>

      <main className="mt-[18px]">
        <section className="flex items-start gap-[8px]">
          <img
            className="mt-[-5px] h-[48px] w-[48px] object-contain"
            src={todayStatusIcon}
            alt=""
          />
          <div className="text-[20px] font-bold leading-[24px] text-[#000000]">
            <p className="text-[14px] font-mediumleading-[16px] text-[#000000]">
              {todayLabel}
            </p>
            <p>
              오늘 업로드 예정 게시글이{" "}
              <span className="text-[#2880EB]">{scheduledCount}개</span> 있어요!
            </p>
          </div>
        </section>

        <section className="mt-[22px] space-y-[12px]">
          {isLoading && (
            <p className="rounded-[18px] bg-white px-[18px] py-[20px] text-[15px] font-medium text-[#7e858c]">
              스케줄링 대기열을 불러오는 중이에요.
            </p>
          )}

          {!isLoading && errorMessage && (
            <p className="rounded-[18px] bg-white px-[18px] py-[20px] text-[15px] font-medium leading-[22px] text-[#ED0404]">
              {errorMessage}
            </p>
          )}

          {!isLoading && !errorMessage && queueItems.length === 0 && (
            <p className="rounded-[18px] bg-white px-[18px] py-[20px] text-[15px] font-medium leading-[22px] text-[#7e858c]">
              24시간 이내 스케줄링 대기열이 없어요.
            </p>
          )}

          {!isLoading && !errorMessage && queueItems.map((item) => (
            <QueueCard
              key={item.id}
              item={item}
              onClick={() => {
                if (!item.clickable) return;

                navigate(`/clear/${item.contentId || item.id}`, {
                  state: {
                    contentType: item.contentType,
                    title: item.title,
                    createdAt: item.executedAt,
                  },
                });
              }}
            />
          ))}
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Queue;
