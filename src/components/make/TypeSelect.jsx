import clipboard from '../../assets/make/clipboard.svg'
import megaphone from '../../assets/make/megaphone.svg'
import AuthButton from '../auth/AuthButton'

const TypeSelect = ({ selectedType, setSelectedType, onNext }) => {
  const isNextActive = selectedType !== ''

  const baseCardStyle =
    'flex flex-row gap-[8px] px-[12px] py-[30px] rounded-[10px] justify-center cursor-pointer border-2'

  const defaultCardStyle =
    'bg-[#f6f6f8] border-[#f6f6f8]'

  const selectedCardStyle =
    'bg-[#e8f3ff] border-[#3182f6]'

  return (
    <div className="relative h-full flex flex-col">
      <div className="px-[16px] mt-[12px]">
        <div className="flex flex-col gap-[4px]">
          <span className="text-[24px] font-bold leading-[41px]">
            어떤 유형의 게시글로 올릴까요?
          </span>

          {/* 블로그용 */}
          <div
            onClick={() => setSelectedType('blog')}
            className={`${baseCardStyle} mt-[30px] ${
              selectedType === 'blog' ? selectedCardStyle : defaultCardStyle
            }`}
          >
            <img src={clipboard} alt="블로그 아이콘" />

            <div className="flex flex-col">
              <span className="text-[20px] font-semibold leading-[33px]">
                블로그용으로 생성할게요
              </span>

              <span className="text-[16px] leading-[24px] font-normal text-[#7e858c]">
                이미지와 키워드를 바탕으로 자세한 설명과 스
                <br />
                토리가 담긴 글을 작성해드려요
              </span>
            </div>
          </div>

          {/* 쇼츠용 */}
          <div
            onClick={() => setSelectedType('shorts')}
            className={`${baseCardStyle} mt-[20px] ${
              selectedType === 'shorts' ? selectedCardStyle : defaultCardStyle
            }`}
          >
            <img src={megaphone} alt="쇼츠 아이콘" />

            <div className="flex flex-col">
              <span className="text-[20px] font-semibold leading-[33px]">
                쇼츠용으로 생성할게요
              </span>

              <span className="text-[16px] leading-[24px] font-normal text-[#7e858c]">
                이미지와 키워드를 바탕으로 짧고 임팩트 있는
                <br />
                영상형 콘텐츠를 만들어드려요
              </span>
            </div>
          </div>
        </div>
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

export default TypeSelect
