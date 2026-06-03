import ImgAdd from './ImgAdd'
import AuthButton from '../auth/AuthButton'

const FileUpload = ({ images, setImages, onNext }) => {
  const isNextActive = images.length > 0

  return (
    <div className="h-full flex flex-col">
      <div>
        <div className="flex flex-col gap-[4px] mt-[12px] pl-[16px]">
          <span className="text-[24px] font-bold leading-[41px]">
            참고 이미지를 업로드 해주세요.
          </span>

          <span className="text-[#7e858c] leading-[24px] text-[16px]">
            홍보에 참고할 이미지를 업로드 해주시면
            <br />
            AI가 관련 이미지로 더 풍성한 홍보를 해드려요!
          </span>
        </div>

        <ImgAdd images={images} setImages={setImages} />
      </div>

      <div className="mt-auto px-[16px] pb-[calc(18px+env(safe-area-inset-bottom))]">
        <AuthButton
          isActive={isNextActive}
          onClick={onNext}
        >
          다음
        </AuthButton>
      </div>
    </div>
  )
}

export default FileUpload
