import { useState } from 'react'
import plusicon from '../../assets/make/plusicon.svg'
import noicon from '../../assets/auth/noicon.svg'
import HashTagModal from './HashTagModal'
import AuthButton from '../auth/AuthButton'

const Keyword = ({
  title,
  onTitleChange,
  selectedMood,
  setSelectedMood,
  includeWeather,
  setIncludeWeather,
  hashTags,
  setHashTags,
  prompt,
  setPrompt,
  onNext,
}) => {
  const [isHashTagModalOpen, setIsHashTagModalOpen] = useState(false)

  const moodTags = ['따뜻함', '차분함', '밝음']

  const isNextActive = title?.trim().length > 0 && selectedMood && hashTags.length > 0

  const moodCommonBtnStyle =
    'text-[20px] leading-[33px] border rounded-[10px] py-[8px] px-[12px] w-[118.04px] h-[49px]'

  const hashCommonBtnStyle =
    'inline-flex items-center justify-center gap-[8px] text-[20px] leading-[33px] border rounded-[10px] py-[8px] pl-[16px] pr-[10px] h-[49px] shrink-0 whitespace-nowrap'

  const baseBtnStyle =
    'border-[#f6f6f8] bg-[#f6f6f8] text-black'

  const selectedBtnStyle =
    'border-[#3182f6] bg-[#3182f6] text-white'

  const handlePromptChange = (e) => {
    setPrompt(e.target.value)

    const maxHeight = 396

    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, maxHeight)}px`
  }

  const handleAddHashTag = (newHashTag) => {
    setHashTags((prev) => [...prev, newHashTag])
  }

  const handleRemoveHashTag = (removeIndex) => {
    setHashTags((prev) => prev.filter((_, index) => index !== removeIndex))
  }

  return (
    <div className="relative h-full flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto px-[16px] pt-[12px] pb-[24px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-[4px]">
          <span className="text-[24px] font-bold leading-[41px]">
            홍보물의 키워드를 알려주세요.
          </span>

          <span className="text-[#7e858c] leading-[24px] text-[16px]">
            AI가 키워드에 알맞는 홍보물을 자동으로 생성해요!
          </span>
        </div>

        <div className="flex flex-col gap-[8px] mt-[30px]">
          <label className="font-pretendard font-medium leading-[21px] text-[#7e858c]">
            제목
          </label>

          <input
            value={title}
            onChange={onTitleChange}
            placeholder="ex) 우리가게 레모네이드 광고"
            className="w-full h-[69px] rounded-[10px] bg-[#f6f6f8] px-[12px] text-[16px] leading-[24px] text-black placeholder:text-[#b0b8c1] outline-none"
          />
        </div>

        {/* 날씨 정보 */}
        <div className="flex flex-col mt-[38px]">
          <span className="text-[14px] font-normal leading-[21px] text-[#7e858c]">
            날씨 정보
          </span>

          <div className="mt-[12px] flex items-center justify-between">
            <span className="font-pretendard text-[20px] font-medium leading-[21px] tracking-normal text-[#000000]">
              실시간 날씨 정보를 포함하여 생성
            </span>

            <button
              type="button"
              role="switch"
              aria-checked={includeWeather}
              onClick={() => setIncludeWeather((prev) => !prev)}
              className={`relative h-[32px] w-[56px] shrink-0 rounded-full transition-colors ${
                includeWeather ? 'bg-[#3182f6]' : 'bg-[#d9d9d9]'
              }`}
            >
              <span
                className={`absolute top-[2px] h-[28px] w-[28px] rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.18)] transition-transform ${
                  includeWeather
                    ? 'left-[26px]'
                    : 'left-[2px]'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 분위기 태그 */}
        <div className="flex flex-col gap-[8px] mt-[38px]">
          <span className="font-pretendard font-medium leading-[21px] text-[#7e858c]">
            분위기 태그
          </span>

          <div className="flex gap-[8px]">
            {moodTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedMood(tag)}
                className={`${moodCommonBtnStyle} ${
                  selectedMood === tag ? selectedBtnStyle : baseBtnStyle
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* 해시태그 */}
          <div className="flex flex-col gap-[8px] mt-[34px]">
            <span className="font-pretendard font-medium leading-[21px] text-[#7e858c]">
              해시태그
            </span>

            <div className="flex flex-wrap gap-[8px]">
              {hashTags.map((tag, index) => (
                <button
                  key={`${tag}-${index}`}
                  type="button"
                  className={`${hashCommonBtnStyle} ${selectedBtnStyle}`}
                >
                  {tag}
                  <img
                    className="h-[25px] w-[25px] shrink-0"
                    src={noicon}
                    alt=""
                    onClick={(event) => {
                      event.stopPropagation()
                      handleRemoveHashTag(index)
                    }}
                  />
                </button>
              ))}

              <div
                onClick={() => setIsHashTagModalOpen(true)}
                className="h-[49px] border-[#e8f3ff] bg-[#e8f3ff] px-[16px] text-center flex items-center justify-center rounded-[10px] cursor-pointer"
              >
                <img className="w-[25px] h-[25px]" src={plusicon} />
              </div>
            </div>
          </div>

          {/* 프롬프트 */}
          <div className="w-full max-h-[449px] flex flex-col gap-[8px] mt-[34px] bg-[#f6f6f8] rounded-[10px] p-[12px] overflow-hidden">
            <span className="font-pretendard font-medium leading-[21px] text-[#7e858c]">
              프롬프트
            </span>

            <textarea
              value={prompt}
              onChange={handlePromptChange}
              placeholder="AI에게 전할 말을 입력해주세요"
              rows={1}
              className="w-full min-h-[33px] max-h-[396px] bg-transparent resize-none overflow-y-auto outline-none text-[16px] leading-[24px] text-black placeholder:text-[#b0b8c1] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            />
          </div>
        </div>
      </div>

      <div className="shrink-0 px-[16px] pb-[calc(18px+env(safe-area-inset-bottom))]">
        <AuthButton
          isActive={!!isNextActive}
          onClick={onNext}
        >
          다음
        </AuthButton>
      </div>

      {isHashTagModalOpen && (
        <HashTagModal
          onClose={() => setIsHashTagModalOpen(false)}
          onAdd={handleAddHashTag}
        />
      )}
    </div>
  )
}

export default Keyword
