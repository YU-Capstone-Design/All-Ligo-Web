import { useState } from 'react'
import noicon from '../../assets/auth/noicon.svg'

const HashTagModal = ({ onClose, onAdd, tags = [], onRemove }) => {
  const [hashTagInput, setHashTagInput] = useState('')

  const handleAddHashTag = () => {
    if (!hashTagInput.trim()) return

    onAdd(hashTagInput.trim())
    setHashTagInput('')
  }

  return (
    <div className="absolute inset-0 z-50 flex items-end bg-black/60">
      <div className="w-full bg-[#f6f6f8] rounded-t-[20px] px-[26px] pt-[32px] pb-[56px]">
        <input
          value={hashTagInput}
          onChange={(e) => setHashTagInput(e.target.value)}
          placeholder="직접 해시태그를 입력해주세요"
          className="w-full border-b border-[#b4bac0] pb-[12px] text-[24px] leading-[28px] outline-none placeholder:text-[#cad0d6]"
        />

        {tags.length > 0 && (
          <div className="mt-[22px] flex flex-wrap  gap-[8px]">
            {tags.map((tag, index) => (
              <button
                key={`${tag}-${index}`}
                type="button"
                onClick={() => onRemove?.(index)}
                className="flex h-[49px] bg-[#ffffff] items-center justify-center gap-[8px] rounded-[10px] bg-[#fffff] py-[8px] pl-[16px] pr-[10px] font-['Apple_SD_Gothic_Neo'] text-[20px] font-medium leading-[33px] tracking-[-0.5px] text-black"
              >
                {tag}
                <img className="h-[25px] w-[25px]" src={noicon} alt="" />
              </button>
            ))}
          </div>
        )}

        <button
          onClick={hashTagInput.trim() ? handleAddHashTag : onClose}
          className={`${tags.length > 0 ? 'mt-[54px]' : 'mt-[100px]'} w-full h-[67px] rounded-[15px] bg-[#3182f6] text-white text-[18px] font-semibold`}
        >
          완료
        </button>
      </div>
    </div>
  )
}

export default HashTagModal
