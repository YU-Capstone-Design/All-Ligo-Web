import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaPlay } from "react-icons/fa6";
import { IoChevronBack } from "react-icons/io5";
import { LuCopy } from "react-icons/lu";
import sparkleBlueIcon from "../assets/queue/star.png";
import {
  cancelContent,
  getContentPreview,
  getPromotionScheduleQueue,
} from "../apis/PromotionApi";

const initialContent = {
  title: "",
  caption: "",
  contentId: "",
  executionId: "",
  promotionId: "",
  url: "",
  updatedAt: "",
  scheduledAt: "",
  storeName: "",
  contentType: "",
  contentTypeLabel: "",
  posterUrl: "",
  videoUrl: "",
  trackUrl: "",
};

const getValidDate = (value) => {
  if (!value) return null;

  const normalizedValue = /[zZ]|[+-]\d{2}:\d{2}$/.test(value)
    ? value
    : `${value}Z`;
  const date = new Date(normalizedValue);

  return date && !Number.isNaN(date.getTime()) ? date : null;
};

const getScheduleDate = (value) => {
  if (!value) return null;

  const date = new Date(value);

  return date && !Number.isNaN(date.getTime()) ? date : null;
};

const formatDate = (value) => {
  const date = getValidDate(value);

  if (!date) return value || "-";

  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value || "";
  const month = parts.find((part) => part.type === "month")?.value || "";
  const day = parts.find((part) => part.type === "day")?.value || "";

  return `${year}. ${month}. ${day}`;
};

const formatScheduleDate = (value) => {
  const date = getScheduleDate(value);

  if (!date) return value || "-";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}. ${month}. ${day}`;
};

const formatScheduleTime = (value) => {
  const date = getScheduleDate(value);

  if (!date) return value || "-";

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

const formatKoreanScheduleTime = (value) => {
  const date = getScheduleDate(value);

  if (!date) return value || "-";

  return `${date.getHours()}시 ${String(date.getMinutes()).padStart(2, "0")}분`;
};

const isSameId = (first, second) =>
  first !== undefined &&
  first !== null &&
  second !== undefined &&
  second !== null &&
  String(first) === String(second);

const getItemContentStatus = (item) => item?.contentStatus;

const isPreviewableScheduleItem = (item) =>
  !getItemContentStatus(item) || getItemContentStatus(item) === "GENERATED";

const findScheduleItem = (scheduleItems, preview, contentId) =>
  scheduleItems.find(
    (item) =>
      isPreviewableScheduleItem(item) &&
      (isSameId(item.contentId, preview.contentId || contentId) ||
        isSameId(item.promotionId, preview.promotionId) ||
        isSameId(item.executionId, preview.executionId))
  );

const getSavedContent = (fallbackContent = {}) => ({
  ...initialContent,
  contentId: fallbackContent.contentId || initialContent.contentId,
  executionId: fallbackContent.executionId || initialContent.executionId,
  promotionId: fallbackContent.promotionId || initialContent.promotionId,
  title: fallbackContent.title || initialContent.title,
  caption: fallbackContent.caption || initialContent.caption,
  url: fallbackContent.url || initialContent.url,
  updatedAt: fallbackContent.updatedAt || initialContent.updatedAt,
  scheduledAt: fallbackContent.scheduledAt || initialContent.scheduledAt,
  storeName: fallbackContent.storeName || initialContent.storeName,
  contentType: fallbackContent.contentType || initialContent.contentType,
  contentTypeLabel:
    fallbackContent.contentTypeLabel || initialContent.contentTypeLabel,
  posterUrl: fallbackContent.posterUrl || initialContent.posterUrl,
  videoUrl: fallbackContent.videoUrl || initialContent.videoUrl,
  trackUrl: fallbackContent.trackUrl || initialContent.trackUrl,
});

const toPreviewContent = (
  preview,
  fallbackContent = initialContent,
  contentId = "",
) => ({
  ...fallbackContent,
  contentId: preview.contentId || contentId || fallbackContent.contentId,
  executionId: preview.executionId || fallbackContent.executionId,
  promotionId: preview.promotionId || fallbackContent.promotionId,
  title: preview.promotionTitle || fallbackContent.title,
  storeName:
    preview.storeName ||
    preview.ownerStoreName ||
    preview.businessName ||
    preview.store?.name ||
    fallbackContent.storeName,
  caption:
    preview.contentType === "VIDEO"
      ? preview.caption || preview.bodyText || fallbackContent.caption
      : preview.bodyText || preview.caption || fallbackContent.caption,
  url:
    preview.storeUrl ||
    preview.redirectUrl ||
    preview.linkUrl ||
    preview.uploadVideoUrl ||
    fallbackContent.url,
  updatedAt: preview.uploadedAt || preview.createdAt || fallbackContent.updatedAt,
  scheduledAt:
    preview.scheduledAt ||
    preview.executedAt ||
    preview.publishTime ||
    preview.schedule?.publishTime ||
    preview.schedule?.scheduledAt ||
    preview.schedule?.executedAt ||
    fallbackContent.scheduledAt,
  contentType: preview.contentType || fallbackContent.contentType,
  contentTypeLabel:
    preview.contentTypeLabel || fallbackContent.contentTypeLabel,
  posterUrl: preview.posterUrl || fallbackContent.posterUrl,
  videoUrl:
    preview.s3VideoUrl ||
    preview.localVideoPath ||
    preview.uploadVideoUrl ||
    fallbackContent.videoUrl,
  trackUrl:
    preview.trackUrl ||
    preview.trackingUrl ||
    fallbackContent.trackUrl,
});

const toScheduledContent = (scheduleItem, fallbackContent = initialContent) => {
  if (!scheduleItem) return fallbackContent;

  return {
    ...fallbackContent,
    contentId: scheduleItem.contentId || fallbackContent.contentId,
    executionId: scheduleItem.executionId || fallbackContent.executionId,
    promotionId: scheduleItem.promotionId || fallbackContent.promotionId,
    scheduledAt:
      scheduleItem.executedAt ||
      scheduleItem.scheduledAt ||
      fallbackContent.scheduledAt,
    contentType: scheduleItem.contentType || fallbackContent.contentType,
    contentTypeLabel:
      scheduleItem.contentTypeLabel || fallbackContent.contentTypeLabel,
    title: scheduleItem.promotionTitle || fallbackContent.title,
  };
};

const getPreviewErrorMessage = (error) => {
  if (error.response?.status === 401) {
    return "로그인이 만료되었어요. 다시 로그인 후 확인해주세요.";
  }

  if (error.response?.status === 400) {
    return "이미 배포되거나 삭제된 콘텐츠에요.";
  }

  if (error.response?.status === 404) {
    return "이미 배포되거나 삭제된 콘텐츠에요.";
  }

  return error.response?.data?.message || "완성된 홍보물을 불러오지 못했어요.";
};

const isPreviewRequestError = (error) =>
  error.response?.status === 400 || error.response?.status === 404;

const isFutureDate = (value) => {
  const date = getScheduleDate(value);

  return date ? date.getTime() > Date.now() : false;
};

const copyText = async (value) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

const CopyButton = ({ value }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await copyText(value);
    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 900);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`absolute right-[10px] top-[10px] flex h-[32px] w-[32px] items-center justify-center rounded-[8px] transition-all active:scale-90 ${
        isCopied
          ? "bg-[#E8F3FF] text-[#2880EB]"
          : "text-[#9DA4AB] hover:bg-[#F3F5F7]"
      }`}
      aria-label={isCopied ? "복사됨" : "복사"}
    >
      <LuCopy className="text-[21px]" />
      {isCopied && (
        <span className="absolute right-[34px] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-[6px] bg-[#2880EB] px-[8px] py-[4px] text-[11px] font-bold text-white shadow-[0_4px_12px_rgba(40,128,235,0.25)]">
          복사됨
        </span>
      )}
    </button>
  );
};

const InfoCard = ({
  label,
  children,
  copyValue = "",
  className = "",
  labelClassName = "",
  contentClassName = "",
}) => (
  <section className={`relative rounded-[8px] bg-white p-[14px] ${className}`}>
    {copyValue && <CopyButton value={copyValue} />}
    <p
      className={`text-[12px] font-semibold leading-[18px] text-[#7E858C] ${labelClassName}`}
    >
      {label}
    </p>
    <div
      className={`mt-[8px] text-[18px] font-bold leading-[27px] text-[#111111] ${contentClassName}`}
    >
      {children}
    </div>
  </section>
);

const ScheduleInfo = ({ updatedAt, scheduledAt }) => (
  <div className="mt-[8px] space-y-[18px] px-[4px]">
    <div>
      <p className="text-[12px] font-semibold leading-[18px] text-[#7E858C]">
        최근 수정일
      </p>
      <p className="mt-[6px] text-[18px] font-bold leading-[27px] text-[#20242A]">
        {formatDate(updatedAt)}
      </p>
    </div>

    {isFutureDate(scheduledAt) && (
      <>
        <div>
          <p className="text-[12px] font-semibold leading-[18px] text-[#7E858C]">
            배포 요일
          </p>
          <p className="mt-[6px] text-[18px] font-bold leading-[27px] text-[#20242A]">
            {formatScheduleDate(scheduledAt)}
          </p>
        </div>
        <div>
          <p className="text-[12px] font-semibold leading-[18px] text-[#7E858C]">
            배포 시간
          </p>
          <p className="mt-[6px] text-[18px] font-bold leading-[27px] text-[#20242A]">
            {formatKoreanScheduleTime(scheduledAt)}
          </p>
        </div>
      </>
    )}
  </div>
);

const ClearPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { productId } = useParams();
  const contentType = location.state?.contentType;
  const [content, setContent] = useState(() =>
    getSavedContent({
      contentId: productId,
      title: location.state?.title,
      updatedAt: location.state?.createdAt,
      scheduledAt: location.state?.scheduledAt || location.state?.executedAt,
      contentType,
      executionId: location.state?.executionId,
      promotionId: location.state?.promotionId,
    }),
  );
  const isVideo = useMemo(
    () =>
      content.contentType || contentType
        ? content.contentType === "VIDEO" ||
          content.contentType === "영상" ||
          contentType === "VIDEO" ||
          contentType === "영상"
        : productId === "2",
    [content.contentType, contentType, productId],
  );
  const contentTypeLabel = isVideo ? "쇼츠" : "블로그";
  const storeName = content.storeName || "가게";
  const title = content.title || "제목을 불러오지 못했어요.";
  const caption = content.caption || "생성된 내용을 불러오지 못했어요.";
  const scheduledTime = formatScheduleTime(content.scheduledAt);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const hasPreviewError = Boolean(errorMessage) && !isLoading;
  const hasScheduleInfo = isFutureDate(content.scheduledAt);

  useEffect(() => {
    const fetchContentPreview = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const scheduleItems = await getPromotionScheduleQueue().catch(() => []);
        const safeScheduleItems = Array.isArray(scheduleItems)
          ? scheduleItems
          : [];
        const requestedContent = {
          contentId: productId,
          executionId: location.state?.executionId,
          promotionId: location.state?.promotionId,
        };
        let preview;
        let matchedSchedule = findScheduleItem(
          safeScheduleItems,
          requestedContent,
          productId
        );
        const previewContentId = matchedSchedule?.contentId || productId;

        try {
          preview = await getContentPreview(previewContentId);
          matchedSchedule =
            findScheduleItem(safeScheduleItems, preview, previewContentId) ||
            matchedSchedule;
        } catch (previewError) {
          if (
            !isPreviewRequestError(previewError) ||
            !matchedSchedule?.contentId ||
            isSameId(matchedSchedule.contentId, previewContentId)
          ) {
            if (matchedSchedule) {
              setContent((prev) => toScheduledContent(matchedSchedule, prev));
            }

            throw previewError;
          }

          preview = await getContentPreview(matchedSchedule.contentId);
        }

        if (
          matchedSchedule?.contentId &&
          !isSameId(matchedSchedule.contentId, productId)
        ) {
          navigate(`/clear/${matchedSchedule.contentId}`, {
            replace: true,
            state: {
              ...location.state,
              contentType: preview.contentType || matchedSchedule.contentType,
              title: preview.promotionTitle || matchedSchedule.promotionTitle,
              createdAt: preview.createdAt || location.state?.createdAt,
              executionId: preview.executionId || matchedSchedule.executionId,
              promotionId: preview.promotionId || matchedSchedule.promotionId,
            },
          });
        }

        setContent((prev) =>
          toScheduledContent(
            matchedSchedule,
            toPreviewContent(preview, prev, previewContentId)
          )
        );
      } catch (error) {
        setErrorMessage(getPreviewErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchContentPreview();
  }, [location.state, navigate, productId]);

  const deleteQueueItem = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      setErrorMessage("");
      await cancelContent(productId);
      navigate("/queue");
    } catch (error) {
      setErrorMessage(
        error.response?.status === 401
          ? "로그인이 만료되었어요. 다시 로그인 후 시도해주세요."
          : error.response?.data?.message || "홍보물 삭제에 실패했어요.",
      );
      setIsDeleting(false);
    }
  };

  const connectionUrl = isVideo ? "" : content.url || content.trackUrl;

  return (
    <div className="no-scrollbar h-[100dvh] overflow-y-auto bg-[#F3F4F6] px-[16px] pb-[calc(24px+env(safe-area-inset-bottom))]">
      <header className="relative flex h-[72px] items-center justify-center">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-[0px] flex h-[40px] w-[40px] items-center justify-center"
          aria-label="뒤로가기"
        >
          <IoChevronBack className="text-[26px] text-[#424950]" />
        </button>
        <h1 className="text-[14px] font-bold text-[#242A2F]">
          홈페이지 게시물
        </h1>
      </header>

      <main>
        {!hasPreviewError && (
          <>
            <h2 className="text-[24px] font-bold leading-[33px] text-[#000000]">
              <span className="text-[#3182F6]">'{storeName}'</span> 홍보용 {contentTypeLabel}가
              <br />
              완성되었습니다!
            </h2>

            <div className="mt-[14px] flex min-h-[45px] items-center gap-[10px] rounded-[8px] bg-[#E8F3FF] px-[12px]">
              <img
                className="h-[25px] w-[25px] shrink-0 object-contain"
                src={sparkleBlueIcon}
                alt=""
              />
              <p className="text-[14px] font-semibold leading-[24px] text-[#000000]">
                {isVideo
                  ? `${scheduledTime}에 YouTube에 자동 업로드 될 예정입니다`
                  : "지금 바로 블로그에 붙여넣고 생성해주세요!"}
              </p>
            </div>
          </>
        )}

        <div className="mt-[14px] space-y-[12px]">
          {isLoading && (
            <p className="rounded-[8px] bg-white p-[14px] text-[14px] font-semibold text-[#7E858C]">
              완성된 홍보물을 불러오는 중이에요.
            </p>
          )}

          {hasPreviewError ? (
            <section className="rounded-[8px] bg-white px-[18px] py-[28px] text-center">
              <p className="text-[18px] font-bold leading-[26px] text-[#20242A]">
                미리보기를 열 수 없어요.
              </p>
              <p className="mt-[8px] text-[14px] font-semibold leading-[22px] text-[#7E858C]">
                {errorMessage}
              </p>
              <button
                type="button"
                onClick={() => navigate("/notifications")}
                className="mt-[22px] h-[48px] w-full rounded-[10px] bg-[#3182F6] text-[15px] font-bold text-white"
              >
                알림으로 돌아가기
              </button>
            </section>
          ) : (
            <>
              <InfoCard
                label="제목"
                copyValue={isVideo ? "" : content.title}
                labelClassName="text-[14px] leading-[20px] text-[#7E858C]"
                contentClassName="text-[24px] leading-[32px] text-[#000000]"
              >
                {title}
              </InfoCard>

              {isVideo ? (
                <>
                  {content.videoUrl ? (
                    <video
                      className="mx-auto h-[660px] w-full max-w-[400px] rounded-[8px] bg-[#B8BEC4] object-cover"
                      controls
                      src={content.videoUrl}
                    />
                  ) : (
                    <section className="mx-auto flex h-[660px] w-full max-w-[400px] items-center justify-center rounded-[8px] bg-[#B8BEC4]">
                      <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#8C969F] text-white/80">
                        <FaPlay className="ml-[2px] text-[14px] text-[#B8BEC4]" />
                      </span>
                    </section>
                  )}

                  <InfoCard label="캡션">
                    <p className="whitespace-pre-line text-[16px] font-semibold leading-[26px] text-[#000000]">
                      {caption}
                    </p>
                  </InfoCard>
                </>
              ) : (
                <InfoCard label="캡션" copyValue={content.caption}>
                  <p className="whitespace-pre-line text-[16px] font-semibold leading-[26px] text-[#000000]">
                    {caption}
                  </p>
                </InfoCard>
              )}

              {connectionUrl && (
                <InfoCard label="연결 URL" copyValue={connectionUrl}>
                  <a
                    href={connectionUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block truncate text-[24px] font-bold leading-[28px] text-[#3182F6] underline-offset-2 active:opacity-70"
                  >
                    {connectionUrl}
                  </a>
                </InfoCard>
              )}

              <ScheduleInfo
                updatedAt={content.updatedAt}
                scheduledAt={content.scheduledAt}
              />
            </>
          )}

          {hasPreviewError && hasScheduleInfo && (
            <ScheduleInfo
              updatedAt={content.updatedAt}
              scheduledAt={content.scheduledAt}
            />
          )}
        </div>

        {!hasPreviewError && (
          <button
            type="button"
            onClick={deleteQueueItem}
            disabled={isDeleting}
            className="mt-[24px] h-[58px] w-full rounded-[12px] bg-[#FFEAEB] text-[16px] font-bold text-[#DA0004] disabled:opacity-60"
          >
            {isDeleting ? "삭제 중" : "삭제"}
          </button>
        )}
      </main>
    </div>
  );
};

export default ClearPage;
