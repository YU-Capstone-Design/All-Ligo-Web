import arrowup from '../../assets/arrow-up.svg'

const MakeHeader = ({ onBack, title = '홍보물 생성' }) => {
  return (
    <div className="flex flex-row items-center py-[11px]">
      <button
        type="button"
        onClick={onBack}
        className="pl-[16px]"
      >
        <img src={arrowup} alt="뒤로가기" />
      </button>

      <div className="text-[14px] w-[314px] leading-[20px] text-center flex justify-center">
        {title}
      </div>
    </div>
  )
}

export default MakeHeader
