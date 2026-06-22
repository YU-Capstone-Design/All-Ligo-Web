import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import calendarIcon from "../assets/calendar.svg";
import alarm from "../assets/alarm.svg";
import erroroutline from "../assets/make/erroroutline.svg";
import arrowup from "../assets/arrow-up.svg";
import plusicon from "../assets/make/plusicon.svg";
import noicon from "../assets/auth/noicon.svg";
import dismissIcon from "../assets/dismiss.svg";
import warningImage from "../assets/image-warning.png";
import MakeHeader from "../components/make/MakeHeader";
import HashTagModal from "../components/make/HashTagModal";
import Calendar from "../components/make/Calendar";
import TimeModal from "../components/make/TimeModal";
import WeekdaySelector from "../components/make/WeekdaySelector";
import AuthButton from "../components/auth/AuthButton";
import {
  deletePromotion,
  getPromotionDetail,
  getPromotionPresignedUrl,
  updatePromotion,
  uploadFileToS3,
} from "../apis/PromotionApi";

const PROMPT_MAX_LENGTH = 200;
const formatMinute = (minute) => String(minute).padStart(2, "0");

const moodTags = ["따뜻함", "차분함", "밝음"];

const dayOfWeekMap = {
  월: "MONDAY",
  화: "TUESDAY",
  수: "WEDNESDAY",
  목: "THURSDAY",
  금: "FRIDAY",
  토: "SATURDAY",
  일: "SUNDAY",
};

const dayLabelMap = Object.entries(dayOfWeekMap).reduce(
  (acc, [label, value]) => ({
    ...acc,
    [value]: label,
  }),
  {}
);

const getScheduleLabel = ({ day, hour, minute, label }) =>
  label || `${day}요일 / ${hour}시 ${formatMinute(minute)}분`;

const toDateTimeValue = (date) => {
  if (!date) return null;

  const pad = (value) => String(value).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
};

const getNextPublishTime = ({ day, hour, minute, deadlineDate }) => {
  const now = new Date();
  const targetDayIndex = Object.keys(dayOfWeekMap).indexOf(day);
  const todayIndex = (now.getDay() + 6) % 7;
  const nextDate = new Date(now);
  let diff = targetDayIndex - todayIndex;

  if (diff < 0) diff += 7;

  nextDate.setDate(now.getDate() + diff);
  nextDate.setHours(hour, minute, 0, 0);

  if (nextDate <= now) {
    nextDate.setDate(nextDate.getDate() + 7);
  }

  if (deadlineDate && nextDate > deadlineDate) {
    throw new Error("업로드 시간이 반복 마감 날짜를 넘을 수 없어요.");
  }

  return toDateTimeValue(nextDate);
};

const parseSchedule = (schedule) => {
  const publishDate = schedule.publishTime
    ? new Date(schedule.publishTime)
    : null;

  return {
    id: schedule.scheduleId || `${schedule.dayOfWeek}-${schedule.publishTime}`,
    day: dayLabelMap[schedule.dayOfWeek] || "목",
    hour: publishDate?.getHours() ?? 0,
    minute: publishDate?.getMinutes() ?? 0,
    publishTime: schedule.publishTime,
  };
};

const ProductEdit = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [title, setTitle] = useState("");
  const [contentImages, setContentImages] = useState([]);
  const [contentType, setContentType] = useState("BLOG");
  const [weatherEnabled, setWeatherEnabled] = useState(false);
  const [selectedMood, setSelectedMood] = useState("따뜻함");
  const [hashTags, setHashTags] = useState([]);
  const [isHashTagModalOpen, setIsHashTagModalOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [uploadTime, setUploadTime] = useState({
    hour: 0,
    minute: 0,
  });
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);

  const isAddScheduleActive = selectedDays.length > 0;

  const handleAddHashTag = (newHashTag) => {
    setHashTags((prev) => [...prev, newHashTag]);
  };

  const handleRemoveHashTag = (removeIndex) => {
    setHashTags((prev) => prev.filter((_, index) => index !== removeIndex));
  };

  const handleRemoveContentImage = (removeId) => {
    setContentImages((prev) => prev.filter((image) => image.id !== removeId));
  };

  const handleImageAddClick = () => {
    if (contentImages.length >= 5) return;

    fileInputRef.current?.click();
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    const remainingCount = 5 - contentImages.length;
    const selectedImages = imageFiles.slice(0, remainingCount);

    setContentImages((prev) => [
      ...prev,
      ...selectedImages.map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        url: URL.createObjectURL(file),
      })),
    ]);

    event.target.value = "";
  };

  const handleRemoveSchedule = (removeId) => {
    setSchedules((prev) => prev.filter((schedule) => schedule.id !== removeId));
  };

  const handleToggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((selectedDay) => selectedDay !== day)
        : [...prev, day]
    );
  };

  const handleAddSchedules = () => {
    if (!isAddScheduleActive) return;

    setSchedules((prev) => [
      ...prev,
      ...selectedDays.map((day) => ({
        id: `${day}-${uploadTime.hour}-${uploadTime.minute}-${Date.now()}-${Math.random()}`,
        day,
        hour: uploadTime.hour,
        minute: uploadTime.minute,
      })),
    ]);
    setSelectedDays([]);
    setIsScheduleModalOpen(false);
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value.slice(0, PROMPT_MAX_LENGTH));
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 360)}px`;
  };

  const handleSubmit = async () => {
    if (!title.trim() || isSubmitting) return;

    if (contentImages.length === 0) {
      setErrorMessage("홍보 이미지는 1장 이상 필요해요.");
      return;
    }

    if (schedules.length === 0) {
      setErrorMessage("업로드 시간은 1개 이상 필요해요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const deadlineDate = selectedEndDate ? new Date(selectedEndDate) : null;

      if (deadlineDate) {
        deadlineDate.setHours(23, 59, 0, 0);
      }

      const nextSchedules = schedules.map((schedule) => {
        const publishTime =
          schedule.publishTime ||
          getNextPublishTime({
            day: schedule.day,
            hour: schedule.hour,
            minute: schedule.minute,
            deadlineDate,
          });

        if (deadlineDate && new Date(publishTime) > deadlineDate) {
          throw new Error("업로드 시간이 반복 마감 날짜를 넘을 수 없어요.");
        }

        return {
          dayOfWeek: dayOfWeekMap[schedule.day],
          publishTime,
        };
      });

      const imageUrls = await Promise.all(
        contentImages.map(async (image) => {
          if (!image.file) return image.url;

          const uploadContentType = image.file.type || "image/jpeg";
          const presignedResponse = await getPromotionPresignedUrl({
            fileName: image.file.name,
            contentType: uploadContentType,
          });

          await uploadFileToS3({
            presignedUrl: presignedResponse.presignedUrl,
            file: image.file,
            contentType: uploadContentType,
          });

          return presignedResponse.fileUrl;
        })
      );

      await updatePromotion({
        promotionId: productId,
        promotionForm: {
          promotionTitle: title.trim(),
          contentType,
          prompt,
          weatherEnabled,
          mode: selectedMood,
          deadline: toDateTimeValue(deadlineDate),
          imageUrls: imageUrls.filter(Boolean),
          tags: hashTags,
          schedules: nextSchedules,
        },
      });

      navigate("/product");
    } catch (error) {
      setErrorMessage(
        error.response?.status === 401
          ? "로그인이 만료되었어요. 다시 로그인 후 시도해주세요."
          : error.response?.data?.message ||
              error.message ||
              "홍보 수정 요청에 실패했어요. 잠시 후 다시 시도해주세요."
      );
      setIsSubmitting(false);
    }
  };

  const handleDeletePromotion = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      setErrorMessage("");
      await deletePromotion(productId);
      navigate("/product", { replace: true });
    } catch (error) {
      setErrorMessage(
        error.response?.status === 401
          ? "로그인이 만료되었어요. 다시 로그인 후 시도해주세요."
          : error.response?.status === 404
            ? "이미 삭제되었거나 찾을 수 없는 홍보 요청이에요."
            : error.response?.data?.message ||
                "홍보 요청 삭제에 실패했어요. 잠시 후 다시 시도해주세요."
      );
      setIsDeleteModalOpen(false);
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const loadPromotionDetail = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const detail = await getPromotionDetail(productId);

        setTitle(detail.promotionTitle || "");
        setContentType(detail.contentType || "BLOG");
        setWeatherEnabled(!!detail.weatherEnabled);
        setSelectedMood(detail.mode || "따뜻함");
        setPrompt(detail.prompt || "");
        setHashTags(detail.tags || []);
        setContentImages(
          (detail.imageUrls || []).map((url, index) => ({
            id: `${url}-${index}`,
            url,
          }))
        );
        setSchedules((detail.schedules || []).map(parseSchedule));
        setSelectedEndDate(detail.deadline ? new Date(detail.deadline) : null);
      } catch (error) {
        setErrorMessage(
          error.response?.status === 404
            ? "해당 홍보 요청을 찾을 수 없어요."
            : error.response?.status === 401
              ? "로그인이 만료되었어요. 다시 로그인 후 시도해주세요."
              : "홍보 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadPromotionDetail();
  }, [productId]);

  const renderEditContent = () => (
    <>
      <main className="no-scrollbar flex-1 overflow-y-auto px-[8px] pb-[20px]">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageChange}
        />

        <section className="mt-[18px] flex items-center gap-[4px] px-[4px]">
          <img className="h-[32px] w-[32px]" src={calendarIcon} alt="" />
          <span className="text-[16px] font-semibold leading-[21px] text-[#424950]">
            콘텐츠 정보
          </span>
        </section>

        <section className="mt-[12px] w-full overflow-hidden">
          <div className="no-scrollbar flex w-full gap-[8px] overflow-x-auto">
            {contentImages.map((image) => (
              <div
                key={image.id}
                className="relative h-[160px] w-[148px] shrink-0 overflow-hidden rounded-[4px] bg-[#8f969c]"
              >
                {image.url && (
                  <img
                    className="h-full w-full object-cover"
                    src={image.url}
                    alt="홍보 이미지"
                  />
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveContentImage(image.id)}
                  className="absolute right-[8px] top-[8px] flex h-[25px] w-[25px] items-center justify-center"
                >
                  <img className="h-[25px] w-[25px]" src={noicon} alt="삭제" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleImageAddClick}
              className="flex h-[160px] w-[148px] shrink-0 items-center justify-center rounded-[4px] bg-[#e8f3ff]"
            >
              <img
                className="h-[50px] w-[50px]"
                src={plusicon}
                alt="이미지 추가"
              />
            </button>
          </div>
        </section>

        <section className="mt-[12px] flex h-[86px] flex-col items-start gap-[8px] rounded-[10px] bg-white p-[12px]">
          <label className="text-[14px] font-semibold leading-[21px] text-[#7E858C]">
            제목
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ex) 우리가게 레몬에이드 광고"
            className="w-full bg-transparent text-[16px] leading-[33px] text-black outline-none placeholder:text-[#B4BAC0]"
          />
        </section>

        <section className="mt-[18px]">
          <span className="px-[12px] font-pretendard text-[14px] font-semibold leading-[21px] text-[#7E858C]">
            분위기 태그
          </span>
          <div className="mt-[8px] flex gap-[8px]">
            {moodTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedMood(tag)}
                className={`h-[49px] flex-1 rounded-[10px] border px-[12px] py-[8px] text-[20px] font-normal leading-[33px] ${
                  selectedMood === tag
                    ? "border-[#3182F6] bg-[#3182F6] text-white"
                    : "border-white bg-white text-black"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-[18px]">
          <span className="px-[12px] font-pretendard text-[14px] font-semibold leading-[21px] text-[#7E858C]">
            해시태그
          </span>
          <div className="mt-[8px] flex flex-wrap gap-[8px]">
            {hashTags.map((tag, index) => (
              <button
                key={`${tag}-${index}`}
                type="button"
                className="flex h-[49px] items-center gap-[8px] rounded-[10px] border border-[#3182F6] bg-[#3182F6] px-[14px] text-[18px] font-normal leading-[33px] text-white"
              >
                {tag}
                <img
                  className="h-[25px] w-[25px]"
                  src={noicon}
                  alt=""
                  onClick={(event) => {
                    event.stopPropagation();
                    handleRemoveHashTag(index);
                  }}
                />
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsHashTagModalOpen(true)}
              className="flex h-[49px] w-[58px] items-center justify-center rounded-[10px] bg-[#E8F3FF]"
            >
              <img
                className="h-[25px] w-[25px]"
                src={plusicon}
                alt="해시태그 추가"
              />
            </button>
          </div>
        </section>

        <section className="mt-[18px] rounded-[10px] bg-white p-[12px]">
          <label className="text-[14px] font-semibold leading-[21px] text-[#7E858C]">
            프롬프트
          </label>
          <textarea
            value={prompt}
            onChange={handlePromptChange}
            placeholder="AI 에게 전할 말을 입력해주세요 (200자 이내)"
            maxLength={PROMPT_MAX_LENGTH}
            className="scrollbar-hide mt-[8px] min-h-[245px] w-full resize-none bg-transparent text-[15px] leading-[27px] text-black outline-none placeholder:text-[#B4BAC0]"
          />
        </section>

        <section className="mt-[18px] flex items-center gap-[8px] px-[4px]">
          <img className="h-[32px] w-[32px]" src={alarm} alt="" />
          <span className="text-[16px] font-semibold not-italic leading-[21px] text-[#424950]">
            업로드 시간
          </span>
        </section>

        <section className="mt-[8px] flex flex-col gap-[10px]">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="flex items-center justify-between rounded-[10px] bg-white py-[18px] pl-[16px] pr-[10px]"
            >
              <span className="font-['Apple_SD_Gothic_Neo'] text-[20px] font-medium leading-[33px] tracking-[-0.5px] text-black">
                {getScheduleLabel(schedule)}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveSchedule(schedule.id)}
                className="flex h-[25px] w-[25px] items-center justify-center"
              >
                <img className="h-[25px] w-[25px]" src={noicon} alt="삭제" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setIsScheduleModalOpen(true)}
            className="flex h-[49px] w-full flex-col items-center justify-center gap-[8px] self-stretch rounded-[10px] bg-[#E8F3FF] px-[16px] py-[8px] text-[24px] leading-[24px] text-[#3182F6]"
          >
            +
          </button>
        </section>

        <section className="mt-[18px]">
          <div className="flex items-center gap-[8px] px-[4px]">
            <img className="h-[32px] w-[32px]" src={calendarIcon} alt="" />
            <span className="font-['Apple_SD_Gothic_Neo'] text-[16px] font-semibold leading-[16px] tracking-[-0.5px] text-[#424950]">
              업로드 마감 (선택)
            </span>
          </div>
          <Calendar
            selectedDate={selectedEndDate}
            onSelectDate={setSelectedEndDate}
          />
        </section>

        <section className="mt-[14px] flex items-center gap-[8px] px-[4px]">
          <img className="h-[32px] w-[32px]" src={dismissIcon} alt="" />
          <span className="text-[16px] font-semibold leading-[21px] text-[#424950]">
            스케줄링 삭제
          </span>
        </section>

        <button
          type="button"
          onClick={() => setIsDeleteModalOpen(true)}
          className="mt-[14px] h-[62px] w-full rounded-[10px] bg-white px-[22px] text-left text-[16px] font-normal leading-[34px] text-[#DC3436]"
        >
          스케줄링 삭제하기
        </button>

        {errorMessage && (
          <p className="mt-[12px] px-[12px] text-[14px] leading-[21px] text-[#ED0404]">
            {errorMessage}
          </p>
        )}
      </main>

      <div className="px-[8px] pb-[calc(18px+env(safe-area-inset-bottom))] pt-[8px]">
        <AuthButton
          isActive={
            !!title.trim() &&
            contentImages.length > 0 &&
            schedules.length > 0 &&
            !isLoading &&
            !isSubmitting
          }
          onClick={handleSubmit}
        >
          {isSubmitting ? "수정 중..." : "수정 완료"}
        </AuthButton>
      </div>
    </>
  );

  const renderScheduleForm = () => (
    <div
      className="absolute inset-0 z-40 flex items-end bg-black/55"
      onClick={() => setIsScheduleModalOpen(false)}
    >
      <div
        className="w-full rounded-t-[20px] bg-white px-[16px] pb-[calc(18px+env(safe-area-inset-bottom))] pt-[20px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-[14px] rounded-[20px] bg-[#e8f3ff] px-[12px] py-[12px]">
            <img src={erroroutline} alt="안내" />
            <span className="text-[14px] leading-[24px] text-[#424950]">
              설정하신 요일과 시간에 맞추어
              <br />
              자동 업로드를 진행해요.
            </span>
          </div>

          <span className="mt-[28px] px-[12px] text-[14px] font-semibold text-[#7e858c]">
            업로드 요일 선택
          </span>

          <div className="mt-[10px]">
            <WeekdaySelector
              selectedDays={selectedDays}
              onToggleDay={handleToggleDay}
            />
          </div>

          <button
            type="button"
            onClick={() => setIsTimeModalOpen(true)}
            className="mt-[20px] flex h-[86px] w-full items-center justify-between rounded-[10px] bg-[#F6F6F8] p-[12px]"
          >
            <div className="flex flex-col gap-[8px] text-left">
              <span className="text-[14px] font-semibold leading-[21px] text-[#7E858C]">
                시간 선택
              </span>

              <span className="text-[24px] font-normal leading-[33px] text-[#000000]">
                {uploadTime.hour}시 {formatMinute(uploadTime.minute)}분
              </span>
            </div>

            <img
              src={arrowup}
              alt="시간 선택"
              className="h-[24px] w-[24px] rotate-180"
            />
          </button>

          <div className="mt-[32px]">
            <AuthButton
              isActive={isAddScheduleActive}
              onClick={handleAddSchedules}
            >
              추가하기
            </AuthButton>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-[#F3F4F6]">
      <MakeHeader
        title="홍보 스케줄링 수정"
        onBack={() => navigate("/product")}
      />

      {renderEditContent()}

      {isHashTagModalOpen && (
        <HashTagModal
          tags={hashTags}
          onRemove={handleRemoveHashTag}
          onClose={() => setIsHashTagModalOpen(false)}
          onAdd={handleAddHashTag}
        />
      )}

      {isDeleteModalOpen && (
        <div
          className="absolute inset-0 z-50 flex items-end bg-black/56"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="h-[275px] w-full rounded-t-[15px] bg-white px-[16px] py-[24px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-full flex-col items-center">
              <img
                className="h-[50px] w-[50px]"
                src={warningImage}
                alt="경고"
              />
              <span className="mt-[24px] text-center text-[24px] font-bold leading-[34px] text-black">
                삭제하면 되돌릴 수 없어요!
              </span>
              <span className="mt-[4px] text-center text-[14px] font-normal leading-[21px] text-[#7E858C]">
                정말 삭제 하시겠어요?
              </span>
              <button
                type="button"
                onClick={handleDeletePromotion}
                disabled={isDeleting}
                className="mt-[24px] flex h-[67px] w-full items-center justify-center rounded-[15px] bg-[#FFE8ED] px-[55px] py-[8px] text-[18px] font-normal leading-[32px] text-[#DF0024] disabled:opacity-60"
              >
                {isDeleting ? "삭제 중..." : "삭제하기"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isScheduleModalOpen && renderScheduleForm()}

      <TimeModal
        isOpen={isTimeModalOpen}
        onClose={() => setIsTimeModalOpen(false)}
        onConfirm={(hour, minute) => {
          setUploadTime({
            hour,
            minute,
          });
        }}
      />
    </div>
  );
};

export default ProductEdit;
