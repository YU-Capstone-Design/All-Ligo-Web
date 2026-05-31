import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import statusCompleteIcon from "../assets/queue/finish.png";

const notifications = [
  { id: 1, time: "방금", recent: true },
  { id: 2, time: "2시간 전", recent: true },
  { id: 3, time: "7시간 전" },
  { id: 4, time: "26.05.26" },
  { id: 5, time: "26.05.26" },
  { id: 6, time: "26.05.26" },
  { id: 7, time: "26.05.26" },
];

const NotificationItem = ({ item }) => {
  const faded = !item.recent;

  return (
    <button
      type="button"
      className={`flex w-full items-start gap-[14px] px-[16px] py-[17px] text-left ${
        item.recent ? "bg-[#E8F3FF]" : "bg-[#F7F8FA]"
      }`}
    >
      <span
        className={`mt-[1px] flex h-[24px] w-[24px] shrink-0 items-center justify-center ${
          faded ? "opacity-55" : ""
        }`}
      >
        <img
          className="h-[24px] w-[24px] object-contain"
          src={statusCompleteIcon}
          alt=""
        />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`block truncate text-[16px] font-bold leading-[22px] ${
            faded ? "text-[#62676D]" : "text-[#000000]"
          }`}
        >
          게시글 제목 콘텐츠 생성 완료
        </span>
        <span
          className={`mt-[2px] block truncate text-[13px] font-semibold leading-[18px] ${
            faded ? "text-[#B8C0C8]" : "text-[#7E858C]"
          }`}
        >
          생성된 콘텐츠를 확인해보세요!
        </span>
      </span>
      <span
        className={`mt-[2px] shrink-0 text-[12px] font-medium ${
          faded ? "text-[#CAD0D6]" : "text-[#8E99A5]"
        }`}
      >
        {item.time}
      </span>
    </button>
  );
};

const Notifications = () => {
  const navigate = useNavigate();
  const recent = notifications.filter((item) => item.recent);
  const past = notifications.filter((item) => !item.recent);

  return (
    <div className="min-h-[100dvh] bg-[#F7F8FA]">
      <header className="relative flex h-[72px] items-center justify-center bg-[#F7F8FA]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-[16px] flex h-[40px] w-[40px] items-center justify-center"
          aria-label="뒤로가기"
        >
          <IoChevronBack className="text-[24px] text-[#424950]" />
        </button>
        <h1 className="text-[15px] font-semibold text-[#3A3A3A]">알림</h1>
      </header>

      <main>
        {recent.map((item) => (
          <NotificationItem key={item.id} item={item} />
        ))}

        <h2 className="px-[16px] pb-[12px] pt-[30px] text-[15px] font-semibold text-[#000000]">
          지난 알림
        </h2>

        {past.map((item) => (
          <NotificationItem key={item.id} item={item} />
        ))}
      </main>
    </div>
  );
};

export default Notifications;
