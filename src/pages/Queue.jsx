import { useNavigate } from "react-router-dom";
import { IoChevronForward } from "react-icons/io5";
import BottomNavigation from "../components/BottomNavigation";
import appname from "../assets/app-name.png";
import bell from "../assets/bell.png";
import todayStatusIcon from "../assets/queue/check.png";
import statusCompleteIcon from "../assets/queue/finish.png";
import statusProgressIcon from "../assets/queue/ing.png";
import statusWaitingIcon from "../assets/queue/wait.png";

const queueItems = [
  { id: 1, status: "생성 완료", type: "영상", tone: "ready" },
  { id: 2, status: "생성 완료", type: "영상", tone: "ready" },
  { id: 3, status: "생성 완료", type: "영상", tone: "ready" },
  { id: 4, status: "생성중", type: "텍스트", tone: "progress" },
  { id: 5, status: "대기중", type: "텍스트", tone: "waiting" },
  { id: 6, status: "대기중", type: "텍스트", tone: "waiting" },
  { id: 7, status: "대기중", type: "텍스트", tone: "waiting" },
];

const getQueueItemTitle = (id) => {
  const savedTitle = localStorage.getItem(`queueItem:${id}:title`);
  return savedTitle || "게시글 제목";
};

const getDeletedQueueItemIds = () => {
  try {
    return JSON.parse(localStorage.getItem("deletedQueueItemIds") || "[]");
  } catch {
    return [];
  }
};

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
};

const QueueCard = ({ item, onClick }) => {
  const styles = statusStyles[item.tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[90px] w-full items-center rounded-[18px] bg-white px-[18px] text-left shadow-[0_10px_24px_rgba(30,42,58,0.03)]"
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

const Queue = () => {
  const navigate = useNavigate();
  const todayLabel = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());
  const deletedItemIds = getDeletedQueueItemIds();
  const visibleQueueItems = queueItems.filter(
    (item) => !deletedItemIds.includes(item.id),
  );
  const scheduledCount = visibleQueueItems.filter((item) =>
    ["progress", "waiting"].includes(item.tone),
  ).length;
  const hydratedQueueItems = visibleQueueItems.map((item) => ({
    ...item,
    title: getQueueItemTitle(item.id),
  }));

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
          {hydratedQueueItems.map((item) => (
            <QueueCard
              key={item.id}
              item={item}
              onClick={() =>
                navigate(`/product/${item.id}/edit`, {
                  state: { contentType: item.type },
                })
              }
            />
          ))}
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Queue;
