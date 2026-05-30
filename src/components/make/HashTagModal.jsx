import { useState } from 'react'
import noicon from '../../assets/auth/noicon.svg'

const HashTagModal = ({ onClose, onAdd, tags = [], onRemove }) => {
  const [hashTagInput, setHashTagInput] = useState('')

  const handleAddHashTag = () => {
    if (!hashTagInput.trim()) return

    onAdd(hashTagInput.trim())
    setHashTagInput('')
    onClose()
  }

  return (
    <div className="absolute inset-0 z-50 flex items-end bg-black/60">
      <div className="w-full bg-white rounded-t-[20px] px-[26px] pt-[32px] pb-[56px]">
        <input
          value={hashTagInput}
          onChange={(e) => setHashTagInput(e.target.value)}
          placeholder="직접 해시태그를 입력해주세요"
          className="w-full border-b border-[#b4bac0] pb-[12px] text-[24px] leading-[28px] outline-none placeholder:text-[#cad0d6]"
        />

        {tags.length > 0 && (
          <div className="mt-[22px] flex flex-wrap gap-[10px]">
            {tags.map((tag, index) => (
              <button
                key={`${tag}-${index}`}
                type="button"
                onClick={() => onRemove?.(index)}
                className="flex h-[42px] items-center gap-[8px] rounded-[8px] bg-[#F6F6F8] px-[13px] text-[18px] font-normal leading-[24px] text-black"
              >
                {tag}
                <img className="h-[20px] w-[20px]" src={noicon} alt="" />
              </button>
            ))}
          </div>
        )}

        <button
          onClick={handleAddHashTag}
          className={`${tags.length > 0 ? 'mt-[54px]' : 'mt-[100px]'} w-full h-[67px] rounded-[15px] bg-[#3182f6] text-white text-[18px] font-semibold`}
        >
          완료
        </button>
      </div>
    </div>
  )
}

export default HashTagModal
