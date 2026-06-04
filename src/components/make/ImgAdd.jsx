import { useRef, useState } from 'react'
import plusicon from '../../assets/make/plusicon.svg'

const ImgAdd = ({ images, setImages }) => {
  const fileInputRef = useRef(null)
  const scrollRef = useRef(null)

  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // + 박스 클릭 시 파일 선택창 열기
  const handleAddClick = () => {
    if (images.length >= 5) return
    fileInputRef.current.click()
  }

  // 이미지 선택 처리
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)

    const imageFiles = files.filter((file) =>
      file.type.startsWith('image/')
    )

    const remainingCount = 5 - images.length
    const selectedImages = imageFiles.slice(0, remainingCount)

    const previewImages = selectedImages.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }))

    setImages((prev) => [...prev, ...previewImages])

    e.target.value = ''
  }

  // 이미지 삭제
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  // 마우스로 가로 스크롤 시작
  const handleMouseDown = (e) => {
    setIsDragging(true)

    const scrollArea = scrollRef.current
    setStartX(e.pageX - scrollArea.offsetLeft)
    setScrollLeft(scrollArea.scrollLeft)
  }

  // 마우스로 가로 스크롤 종료
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  // 마우스로 드래그 중 스크롤 이동
  const handleMouseMove = (e) => {
    if (!isDragging) return

    e.preventDefault()

    const scrollArea = scrollRef.current
    const x = e.pageX - scrollArea.offsetLeft
    const walk = x - startX

    scrollArea.scrollLeft = scrollLeft - walk
  }

  return (
    <div className="mt-[23.11px] w-full overflow-hidden">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleImageChange}
      />

      <div
        ref={scrollRef}
        className="w-full overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <div className="flex gap-[8px] pl-[16px] pr-[16px] w-max">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative shrink-0 w-[148px] h-[160px] rounded-[4px] overflow-hidden bg-[#8f969c]"
            >
              <img
                src={image.previewUrl}
                alt={`업로드 이미지 ${index + 1}`}
                className="w-full h-full object-cover pointer-events-none"
              />

              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-[8px] right-[8px] w-[25px] h-[25px] rounded-full bg-[#d9dee3] text-[#8f969c] flex items-center justify-center text-[16px] font-bold"
              >
                ×
              </button>
            </div>
          ))}

          {images.length < 5 && (
            <button
              type="button"
              onClick={handleAddClick}
              className="shrink-0 w-[148px] h-[160px] bg-[#e8f3ff] rounded-[4px] flex flex-col justify-center items-center"
            >
              <img
                className="w-[50px] h-[50px]"
                src={plusicon}
                alt="이미지 추가"
              />

              <div className="text-center leading-[28px] text-[20px] text-[#9da4ab]">
                {images.length}/5
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImgAdd
