import { useState } from "react";
import { useNavigate } from "react-router-dom";
import arrowup from "../assets/arrow-up.svg";
import calendar from "../assets/calendar.svg";
import alarm from "../assets/alarm.svg";
import erroroutline from "../assets/make/erroroutline.svg";
import plusicon from "../assets/make/plusicon.svg";
import noicon from "../assets/auth/noicon.svg";
import MakeHeader from "../components/make/MakeHeader";
import HashTagModal from "../components/make/HashTagModal";
import WeekdaySelector from "../components/make/WeekdaySelector";
import TimeModal from "../components/make/TimeModal";
import Calendar from "../components/make/Calendar";
import AuthButton from "../components/auth/AuthButton";

const moodTags = ["따뜻함", "차분함", "밝음"];

const ProductEdit = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("우리가게 레몬에이드 광고");
  const [selectedMood, setSelectedMood] = useState("따뜻함");
  const [hashTags, setHashTags] = useState([
    "맛있는",
    "행복한",
    "커플",
    "데이트",
    "맛집",
  ]);
  const [isHashTagModalOpen, setIsHashTagModalOpen] = useState(false);
  const [prompt, setPrompt] = useState(
    "요즘 핫한 맛집/술집을 소개하는 짧은 영상\n퇴근 후나 친구들이랑 가볍게 한잔하기 좋은 분위기를 담아줘. 처음엔 가게 외관이 보이면서 자연스럽게 사람들이 들어가는 장면, 그 다음에는 음식이 지글지글 나오거나 김 올라오는 장면을 클로즈업으로 보여주고, 술 따르는 순간이나 잔 부딪히는 장면도 감각적으로 담아줘.\n중간중간 친구들이 웃으면서 대화하는 자연스러운 분위기도 넣고, 마지막에는 테이블 가득 차려진 음식이랑 전체 분위기를 보여주면 좋겠어. 전체적으로 따뜻한 색감에 너무 과하지 않게, 진짜 내가 가기 앉아있는 느낌 나게 만들어줘.\n자막은 부담스럽지 않게, 오늘은 여기 어때? 분위기까지 괜찮은 곳 정도로 자연스럽게 들어가면 좋겠어."
  );
  const [selectedDay, setSelectedDay] = useState("목");
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [uploadTime, setUploadTime] = useState({ hour: 16, minute: 43 });
  const [selectedEndDate, setSelectedEndDate] = useState(new Date(2026, 4, 18));

  const handleAddHashTag = (newHashTag) => {
    setHashTags((prev) => [...prev, newHashTag]);
  };

  const handleRemoveHashTag = (removeIndex) => {
    setHashTags((prev) => prev.filter((_, index) => index !== removeIndex));
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 360)}px`;
  };

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-[#F3F4F6]">
      <MakeHeader
        title="홍보 스케줄링 수정"
        onBack={() => navigate("/product")}
      />

      <main className="no-scrollbar flex-1 overflow-y-auto px-[8px] pb-[20px]">
        <section className="mt-[18px] flex items-center gap-[4px] px-[4px]">
          <img className="h-[32px] w-[32px]" src={calendar} alt="" />
          <span className="text-[16px] font-semibold leading-[21px] text-[#424950]">
            콘텐츠 정보
          </span>
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
                onClick={() => handleRemoveHashTag(index)}
                className="flex h-[49px] items-center gap-[8px] rounded-[10px] bg-white px-[14px] text-[18px] font-normal leading-[33px] text-black"
              >
                {tag}
                <img className="h-[25px] w-[25px]" src={noicon} alt="" />
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsHashTagModalOpen(true)}
              className="flex h-[49px] w-[58px] items-center justify-center rounded-[10px] bg-[#E8F3FF]"
            >
              <img className="h-[25px] w-[25px]" src={plusicon} alt="해시태그 추가" />
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
            className="scrollbar-hide mt-[8px] min-h-[245px] w-full resize-none bg-transparent text-[15px] leading-[27px] text-black outline-none"
          />
        </section>

        <section className="mt-[18px] flex items-center gap-[8px] px-[4px]">
          <img className="h-[25px] w-[25px]" src={alarm} alt="" />
          <span className="text-[16px] font-semibold not-italic leading-[21px] text-[#424950]">
            업로드 시간 선택
          </span>
        </section>

        <div className="mt-[8px] flex gap-[14px] items-center rounded-[20px] bg-[#E8F3FF] px-[12px] py-[12px]">
          <img className="h-[25px] w-[25px]" src={erroroutline} alt="안내" />
          <span className="text-[14px] leading-[24px] text-[#424950]">
            해당 게시글 생성은 1-2시간이 소요되므로 현재 시간부터
            <br />
            1시간 뒤 시간부터 설정 가능합니다.
          </span>
        </div>

        <section className="mt-[20px]">
          <span className="px-[12px] text-[14px] font-normal text-[#7E858C]">
            업로드 요일 선택
          </span>
          <div className="mt-[8px]">
            <WeekdaySelector
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
            />
          </div>
        </section>

        <button
          type="button"
          onClick={() => setIsTimeModalOpen(true)}
          className="mt-[12px] flex h-[86px] w-full items-center justify-between rounded-[10px] bg-white p-[12px]"
        >
          <div className="flex flex-col gap-[8px] text-left">
            <span className="text-[14px] font-normal leading-[21px] text-[#7E858C]">
              시간 선택
            </span>
            <span className="text-[24px] font-normal leading-[33px] text-black">
              {uploadTime.hour}시 {uploadTime.minute}분
            </span>
          </div>
          <img
            src={arrowup}
            alt="시간 선택"
            className="h-[24px] w-[24px] rotate-180"
          />
        </button>

        <section className="mt-[18px]">
          <span className="px-[12px] text-[14px] font-normal text-[#7E858C]">
            반복 마감 날짜(선택)
          </span>
          <Calendar
            selectedDate={selectedEndDate}
            onSelectDate={setSelectedEndDate}
          />
        </section>

        <button
          type="button"
          className="mt-[16px] h-[62px] w-full rounded-[10px] bg-white px-[22px] text-left text-[16px] font-normal leading-[34px] text-[#DC3436]"
        >
          스케줄링 삭제하기
        </button>
      </main>

      <div className="px-[8px] pb-[calc(18px+env(safe-area-inset-bottom))] pt-[8px]">
        <AuthButton isActive={!!title.trim()} onClick={() => navigate("/product")}>
          수정 완료
        </AuthButton>
      </div>

      <TimeModal
        isOpen={isTimeModalOpen}
        onClose={() => setIsTimeModalOpen(false)}
        onConfirm={(hour, minute) => setUploadTime({ hour, minute })}
      />

      {isHashTagModalOpen && (
        <HashTagModal
          tags={hashTags}
          onRemove={handleRemoveHashTag}
          onClose={() => setIsHashTagModalOpen(false)}
          onAdd={handleAddHashTag}
        />
      )}
    </div>
  );
};

export default ProductEdit;
