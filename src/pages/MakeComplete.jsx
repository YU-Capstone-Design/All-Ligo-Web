import { useNavigate } from 'react-router-dom'
import clockwise from '../assets/make/clockwise.svg'
import AuthButton from '../components/auth/AuthButton'

const MakeComplete = () => {
  const navigate = useNavigate()

  const handleHomeClick = () => {
    navigate('/home')
  }

  return (
    <div className="relative h-[100dvh] flex flex-col">
      <div className="flex flex-col items-center justify-center mt-[114px]">
        <img
          className="w-[125px] h-[125px] mb-[20px] px-[15.61px] py-[15.62px]"
          src={clockwise}
          alt="홍보물 생성 중"
        />

        <div className="flex flex-col justify-center items-center font-bold text-[24px] leading-[34px]">
          <span>올리고가 열심히</span>
          <span>홍보물을 생성 중이에요!</span>
        </div>

        <span className="mt-[12px] font-bold text-[16px] text-[#7e858c] leading-[16px]">
          조금만 기다려주세요
        </span>
      </div>

      <div className="mt-auto px-[16px] pb-[calc(18px+env(safe-area-inset-bottom))]">
        <AuthButton
          isActive={true}
          onClick={handleHomeClick}
        >
          홈으로 이동
        </AuthButton>
      </div>
    </div>
  )
}

export default MakeComplete
