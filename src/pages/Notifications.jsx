import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import statusCompleteIcon from "../assets/queue/finish.png";
import {
  getNotifications,
  markNotificationAsRead,
} from "../apis/NotificationApi";

const parseKoreanDate = (value) => {
  if (!value) return null;

  const normalizedValue = /[zZ]|[+-]\d{2}:\d{2}$/.test(value)
    ? value
    : `${value}Z`;
  const date = new Date(normalizedValue);

  return Number.isNaN(date.getTime()) ? null : date;
};

const formatNotificationTime = (createdAt) => {
  if (!createdAt) return "";

  const createdDate = parseKoreanDate(createdAt);

  if (!createdDate) return "";

  const diffMinutes = Math.max(
    0,
    Math.floor((Date.now() - createdDate.getTime()) / 60000)
  );

  if (diffMinutes < 1) return "방금";
  if (diffMinutes < 60) return `${diffMinutes}분전`;
  if (diffMinutes < 24 * 60) return `${Math.floor(diffMinutes / 60)}시간전`;

  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(createdDate);
  const year = parts.find((part) => part.type === "year")?.value || "";
  const month = parts.find((part) => part.type === "month")?.value || "";
  const day = parts.find((part) => part.type === "day")?.value || "";

  return `${year}.${month}.${day}`;
};

const getNestedValue = (source, keys) => {
  for (const key of keys) {
    const value = key.split(".").reduce((current, path) => current?.[path], source);

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return undefined;
};

const normalizeNotification = (notification = {}) => ({
  ...notification,
  notificationId: getNestedValue(notification, [
    "notificationId",
    "id",
    "notification.notificationId",
  ]),
  contentId: getNestedValue(notification, [
    "contentId",
    "content.contentId",
    "payload.contentId",
    "data.contentId",
  ]),
  executionId: getNestedValue(notification, [
    "executionId",
    "promotionExecutionId",
    "content.executionId",
    "payload.executionId",
    "data.executionId",
  ]),
  promotionId: getNestedValue(notification, [
    "promotionId",
    "content.promotionId",
    "payload.promotionId",
    "data.promotionId",
  ]),
  promotionTitle: getNestedValue(notification, [
    "promotionTitle",
    "title",
    "content.promotionTitle",
    "payload.promotionTitle",
    "data.promotionTitle",
  ]),
  contentType: getNestedValue(notification, [
    "contentType",
    "content.contentType",
    "payload.contentType",
    "data.contentType",
  ]),
  scheduledAt: getNestedValue(notification, [
    "scheduledAt",
    "executedAt",
    "publishTime",
    "content.scheduledAt",
    "content.executedAt",
    "content.publishTime",
    "payload.scheduledAt",
    "payload.executedAt",
    "payload.publishTime",
    "data.scheduledAt",
    "data.executedAt",
    "data.publishTime",
  ]),
});

const NotificationItem = ({ item, onClick }) => {
  const faded = item.isRead;

  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      className={`flex w-full items-start gap-[14px] px-[16px] py-[17px] text-left ${
        item.isRead ? "bg-[#F7F8FA]" : "bg-[#E8F3FF]"
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
          {item.notificationTitle}
        </span>
        <span
          className={`mt-[2px] block truncate text-[13px] font-semibold leading-[18px] ${
            faded ? "text-[#B8C0C8]" : "text-[#7E858C]"
          }`}
        >
          {item.message}
        </span>
      </span>
      <span
        className={`mt-[2px] shrink-0 text-[12px] font-medium ${
          faded ? "text-[#CAD0D6]" : "text-[#8E99A5]"
        }`}
      >
        {formatNotificationTime(item.createdAt)}
      </span>
    </button>
  );
};

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const unreadNotifications = notifications.filter((item) => !item.isRead);
  const readNotifications = notifications.filter((item) => item.isRead);

  const handleNotificationClick = async (item) => {
    try {
      await markNotificationAsRead(item.notificationId);
      const nextNotification = { ...item, isRead: true };

      if (!item.isRead) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.notificationId === item.notificationId
              ? nextNotification
              : notification
          )
        );
      }

      const contentId = item.contentId;

      if (contentId) {
        navigate(`/clear/${contentId}`, {
          state: {
            contentType: nextNotification.contentType,
            title: nextNotification.promotionTitle,
            createdAt: nextNotification.createdAt,
            executionId: nextNotification.executionId,
            promotionId: nextNotification.promotionId,
            notificationId: nextNotification.notificationId,
            scheduledAt: nextNotification.scheduledAt,
          },
        });
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "알림 읽음 처리에 실패했어요."
      );
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadNotifications = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const nextNotifications = await getNotifications();

        if (isMounted) {
          const sortedNotifications = Array.isArray(nextNotifications)
            ? nextNotifications.map(normalizeNotification).sort(
                (a, b) =>
                  (parseKoreanDate(b.createdAt)?.getTime() || 0) -
                  (parseKoreanDate(a.createdAt)?.getTime() || 0)
              )
            : [];

          setNotifications(sortedNotifications);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error.response?.data?.message || "알림 목록을 불러오지 못했어요."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

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
        {errorMessage && (
          <p className="px-[16px] py-[18px] text-[14px] font-medium text-[#DF0024]">
            {errorMessage}
          </p>
        )}

        {isLoading && (
          <p className="px-[16px] py-[30px] text-center text-[14px] font-medium text-[#9DA4AB]">
            알림을 불러오는 중입니다.
          </p>
        )}

        {!isLoading && notifications.length === 0 && (
          <p className="px-[16px] py-[30px] text-center text-[14px] font-medium text-[#9DA4AB]">
            도착한 알림이 없습니다.
          </p>
        )}

        {unreadNotifications.map((item) => (
          <NotificationItem
            key={item.notificationId}
            item={item}
            onClick={handleNotificationClick}
          />
        ))}

        {readNotifications.length > 0 && (
          <h2 className="px-[16px] pb-[12px] pt-[30px] text-[15px] font-semibold text-[#000000]">
            지난 알림
          </h2>
        )}

        {readNotifications.map((item) => (
          <NotificationItem
            key={item.notificationId}
            item={item}
            onClick={handleNotificationClick}
          />
        ))}
      </main>
    </div>
  );
};

export default Notifications;
