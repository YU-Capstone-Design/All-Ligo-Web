import OwnerLoginHeader from '../../components/auth/OwnerLoginHeader'
import checkmark from '../../assets/auth/checkmark.svg'
import AuthButton from '../../components/auth/AuthButton'
import { useNavigate } from 'react-router-dom'

const SuccessPage = () => {
  const navigate = useNavigate()

  const handleStartClick = () => {
    navigate('/home')
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <OwnerLoginHeader />

      <div className='flex flex-col justify-center items-center mt-[119px] gap-[12px]'>
        <img className='mb-[8px]' src={checkmark} alt='회원가입 완료' />

        <span className='font-bold text-[24px] leading-[34px]'>
          환영합니다!
        </span>

        <span className='text-[#7e858c] text-[16px] leading-[16px]'>
          회원가입이 완료되었습니다.
        </span>
      </div>

      <div className='mt-auto px-[25.89px] pb-[37px]'>
        <AuthButton
          isActive={true}
          onClick={handleStartClick}
        >
          시작하기
        </AuthButton>
      </div>
    </div>
  )
}

export default SuccessPage
