import React, { useState } from 'react'
import plusicon from '../../assets/make/plusicon.svg'

const Keyword = () => {
  const [selectedMood, setSelectedMood] = useState('')
  const [prompt, setPrompt] = useState('')

  const moodTags = ['따뜻함', '차분함', '밝음']
  const hashTags = ['맛있는', '행복한', '커플', '데이트', '맛집', '가성비']

  const moodCommonBtnStyle =
    'text-[20px] leading-[33px] border rounded-[10px] py-[8px] px-[12px] w-[118.04px] h-[49px]'

  const baseBtnStyle =
    'border-[#f6f6f8] bg-[#f6f6f8] text-black'

  const selectedBtnStyle =
    'border-[#3182f6] bg-[#3182f6] text-white'

  const handlePromptChange = (e) => {
    setPrompt(e.target.value)

    e.target.style.height = 'auto'
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  return (
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
            <div className="h-[49px] border-[#e8f3ff] bg-[#e8f3ff] px-[16px] text-center flex items-center justify-center rounded-[10px] cursor-pointer">
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
            className="w-full min-h-[33px] bg-transparent resize-none overflow-hidden outline-none text-[16px] leading-[24px] text-black placeholder:text-[#b0b8c1]"
          />
        </div>
      </div>
    </div>
  )
}

export default Keyword