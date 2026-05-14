import React, { useState } from 'react'

const HashTagModal = ({ onClose, onAdd }) => {
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

        <button
          onClick={handleAddHashTag}
          className="mt-[100px] w-full h-[67px] rounded-[15px] bg-[#3182f6] text-white text-[18px] font-semibold"
        >
          완료
        </button>
      </div>
    </div>
  )
}

export default HashTagModal