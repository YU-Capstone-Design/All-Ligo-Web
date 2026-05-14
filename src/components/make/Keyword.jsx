import React, { useState } from 'react'
import plusicon from '../../assets/make/plusicon.svg'
import HashTagModal from './HashTagModal'
import AuthButton from '../auth/AuthButton'

const Keyword = ({ onNext }) => {
  const [selectedMood, setSelectedMood] = useState('')
  const [selectedHashTagIndex, setSelectedHashTagIndex] = useState(null)
  const [hashTags, setHashTags] = useState([])
  const [isHashTagModalOpen, setIsHashTagModalOpen] = useState(false)
  const [prompt, setPrompt] = useState('')

  const moodTags = ['따뜻함', '차분함', '밝음']

  const isNextActive = selectedMood && hashTags.length > 0

  const moodCommonBtnStyle =
    'text-[20px] leading-[33px] border rounded-[10px] py-[8px] px-[12px] w-[118.04px] h-[49px]'

  const hashCommonBtnStyle =
    'text-[20px] leading-[33px] border rounded-[10px] py-[8px] px-[16px] h-[49px] shrink-0 whitespace-nowrap'

  const baseBtnStyle =
    'border-[#f6f6f8] bg-[#f6f6f8] text-black'

  const selectedBtnStyle =
    'border-[#3182f6] bg-[#3182f6] text-white'

  const handlePromptChange = (e) => {
    setPrompt(e.target.value)

    const maxHeight = 360 // 임의 조정 프롬포트 최대 크기

    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, maxHeight)}px`
  }

  const handleAddHashTag = (newHashTag) => {
    setHashTags((prev) => [...prev, newHashTag])
    setSelectedHashTagIndex(null)
  }

  return (
    <div className="relative h-full flex flex-col">
      <div className="px-[16px] mt-[12px]">
        <div className="flex flex-col gap-[4px]">
          <span className="text-[24px] font-bold leading-[41px]">
            홍보물의 키워드를 알려주세요.
          </span>

          <span className="text-[#7e858c] leading-[24px] text-[16px]">
            AI가 키워드에 알맞는 홍보물을 자동으로 생성해요!
          </span>
        </div>

        {/* 분위기 태그 */}
        <div className="flex flex-col gap-[8px] mt-[43.11px]">
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
                  onClick={() => setSelectedHashTagIndex(index)}
                  className={`${hashCommonBtnStyle} ${
                    selectedHashTagIndex === index
                      ? selectedBtnStyle
                      : baseBtnStyle
                  }`}
                >
                  {tag}
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
          <div className="w-full flex flex-col gap-[8px] mt-[34px] bg-[#f6f6f8] rounded-[10px] p-[12px]">
            <span className="font-pretendard font-medium leading-[21px] text-[#7e858c]">
              프롬프트
            </span>

            <textarea
              value={prompt}
              onChange={handlePromptChange}
              placeholder="AI에게 전할 말을 입력해주세요"
              rows={1}
              className="w-full min-h-[33px] max-h-[449px] bg-transparent resize-none overflow-y-auto outline-none text-[16px] leading-[24px] text-black placeholder:text-[#b0b8c1] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            />
          </div>
        </div>
      </div>

      <div className="mt-auto px-[16px] pb-[calc(18px+env(safe-area-inset-bottom))]">
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