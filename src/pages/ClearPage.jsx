import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaPlay } from "react-icons/fa6";
import { IoChevronBack } from "react-icons/io5";
import { LuCopy } from "react-icons/lu";
import sparkleBlueIcon from "../assets/queue/star.png";
import { cancelContent, getContentPreview } from "../apis/PromotionApi";

const promptText =
  "요즘 핫한 맛집/술집을 소개하는 짧은 영상\n퇴근 후나 친구들이랑 가볍게 한잔하기 좋은 분위기를 담아줘. 처음엔 가게 외관이 보이면서 자연스럽게 사람들이 들어가는 장면, 그 다음에는 음식이 지글지글 나오거나 김 올라오는 장면을 클로즈업으로 보여주고, 술 따르는 순간이나 잔 부딪히는 장면도 감각적으로 담아줘.\n중간중간 친구들이 웃으면서 대화하는 자연스러운 분위기도 넣고, 마지막에는 테이블 가득 차려진 음식이랑 전체 분위기를 보여주면 좋겠어. 전체적으로 따뜻한 색감에 너무 과하지 않게, 진짜 내가 가기 앉아있는 느낌 나게 만들어줘.\n자막은 부담스럽지 않게, 오늘은 여기 어때? 분위기까지 괜찮은 곳 정도로 자연스럽게 들어가면 좋겠어.";

const initialContent = {
  title: "게시글 제목",
  caption: promptText,
  url: "https://map.naver.com/p/entry/...",
  updatedAt: "2026. 05. 12",
  contentType: "",
  videoUrl: "",
};

const formatDate = (value) => {
  const date = value ? new Date(value) : null;

  if (!date || Number.isNaN(date.getTime())) {
    return value || initialContent.updatedAt;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}. ${month}. ${day}`;
};

const getSavedContent = (productId, fallbackContent = {}) => ({
  ...initialContent,
  title:
    localStorage.getItem(`queueItem:${productId}:title`) ||
    fallbackContent.title ||
    initialContent.title,
  caption:
    localStorage.getItem(`queueItem:${productId}:caption`) ||
    fallbackContent.caption ||
    initialContent.caption,
  url:
    localStorage.getItem(`queueItem:${productId}:url`) ||
    fallbackContent.url ||
    initialContent.url,
  updatedAt:
    localStorage.getItem(`queueItem:${productId}:updatedAt`) ||
    fallbackContent.updatedAt ||
    initialContent.updatedAt,
  contentType: fallbackContent.contentType || initialContent.contentType,
  videoUrl: fallbackContent.videoUrl || initialContent.videoUrl,
});

const toPreviewContent = (preview, fallbackContent = initialContent) => ({
  ...fallbackContent,
  title: preview.promotionTitle || fallbackContent.title,
  caption:
    preview.contentType === "VIDEO"
      ? preview.caption || preview.bodyText || fallbackContent.caption
      : preview.bodyText || preview.caption || fallbackContent.caption,
  url:
    preview.uploadVideoUrl ||
    preview.storeUrl ||
    preview.redirectUrl ||
    preview.linkUrl ||
    fallbackContent.url,
  updatedAt: formatDate(
    preview.uploadedAt || preview.createdAt || fallbackContent.updatedAt,
  ),
  contentType: preview.contentType || fallbackContent.contentType,
  videoUrl:
    preview.s3VideoUrl ||
    preview.localVideoPath ||
    preview.uploadVideoUrl ||
    fallbackContent.videoUrl,
});

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

const ScheduleInfo = ({ updatedAt }) => (
  <div className="mt-[8px] space-y-[18px] px-[4px]">
    <div>
      <p className="text-[12px] font-semibold leading-[18px] text-[#7E858C]">
        최근 수정일
      </p>
      <p className="mt-[6px] text-[18px] font-bold leading-[27px] text-[#20242A]">
        {updatedAt}
      </p>
    </div>
    <div>
      <p className="text-[12px] font-semibold leading-[18px] text-[#7E858C]">
        배포 요일
      </p>
      <p className="mt-[6px] text-[18px] font-bold leading-[27px] text-[#20242A]">
        2026. 05. 12
      </p>
    </div>
    <div>
      <p className="text-[12px] font-semibold leading-[18px] text-[#7E858C]">
        배포 시간
      </p>
      <p className="mt-[6px] text-[18px] font-bold leading-[27px] text-[#20242A]">
        16시 15분
      </p>
    </div>
  </div>
);

const ClearPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { productId } = useParams();
  const contentType = location.state?.contentType;
  const [content, setContent] = useState(() =>
    getSavedContent(productId, {
      title: location.state?.title,
      updatedAt: location.state?.createdAt,
      contentType,
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
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchContentPreview = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const preview = await getContentPreview(productId);
        setContent((prev) => toPreviewContent(preview, prev));
      } catch (error) {
        setErrorMessage(
          error.response?.status === 401
            ? "로그인이 만료되었어요. 다시 로그인 후 확인해주세요."
            : error.response?.data?.message ||
                "완성된 홍보물을 불러오지 못했어요.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchContentPreview();
  }, [productId]);

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
        <h2 className="text-[24px] font-bold leading-[33px] text-[#000000]">
          <span className="text-[#3182F6]">'돼지상회'</span> 홍보용 {contentTypeLabel}가
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
              ? "18:00에 YouTube에 자동 업로드 될 예정입니다"
              : "지금 바로 블로그에 붙여넣고 생성해주세요!"}
          </p>
        </div>

        <div className="mt-[14px] space-y-[12px]">
          {isLoading && (
            <p className="rounded-[8px] bg-white p-[14px] text-[14px] font-semibold text-[#7E858C]">
              완성된 홍보물을 불러오는 중이에요.
            </p>
          )}

          {errorMessage && (
            <p className="rounded-[8px] bg-white p-[14px] text-[14px] font-semibold leading-[22px] text-[#DA0004]">
              {errorMessage}
            </p>
          )}

          <InfoCard
            label="제목"
            copyValue={isVideo ? "" : content.title}
            labelClassName="text-[14px] leading-[20px] text-[#7E858C]"
            contentClassName="text-[24px] leading-[32px] text-[#000000]"
          >
            {content.title}
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
                  {content.caption}
                </p>
              </InfoCard>
            </>
          ) : (
            <InfoCard label="캡션" copyValue={content.caption}>
              <p className="whitespace-pre-line text-[16px] font-semibold leading-[26px] text-[#000000]">
                {content.caption}
              </p>
            </InfoCard>
          )}

          <InfoCard label="연결 URL" copyValue={content.url}>
            <p className="truncate text-[24px] font-bold leading-[28px] text-[#3182F6]">
              {content.url}
            </p>
          </InfoCard>

          <ScheduleInfo updatedAt={content.updatedAt} />
        </div>

        <button
          type="button"
          onClick={deleteQueueItem}
          disabled={isDeleting}
          className="mt-[24px] h-[58px] w-full rounded-[12px] bg-[#FFEAEB] text-[16px] font-bold text-[#DA0004] disabled:opacity-60"
        >
          {isDeleting ? "삭제 중" : "삭제"}
        </button>
      </main>
    </div>
  );
};

export default ClearPage;
