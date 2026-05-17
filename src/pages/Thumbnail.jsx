import React from 'react'
import { useNavigate } from 'react-router-dom'
import AuthButton from '../components/auth/AuthButton'
import ligoicon from '../assets/ligoicon.svg'
const Thumbnail = () => {
  const navigate = useNavigate()

  const handleStartClick = () => {
    navigate('/splash')
  }

  return (
    <div className='min-h-screen flex flex-col justify-between pb-[30px]'>
      <div className='flex flex-col gap-[25px]'>
        <div className='flex flex-col ml-[25.89px] pt-[54px] tracking-[-0.5px]'>
          <img className="w-[83px] h-[88px] mb-[25px]" src={ligoicon}/>
          <span className='font-bold text-[36px] leading-[36px]'>
            올리고,
          </span>

          <span className='font-bold text-[24px] leading-[36px]'>
            한 번 설정하면 홍보가 올라갑니다
          </span>
        </div>

        <div className='flex flex-col ml-[25.89px] tracking-[-0.5px] text-[#7e858c] text-[16px] font-semibold'>
          <span className='leading-[24px]'>
            이미지와 키워드만 입력하면
          </span>

          <span className='leading-[24px]'>
            <span className='text-[#3182f6]'>콘텐츠 생성</span>부터{' '}
            <span className='text-[#3182f6]'>업로드</span>까지 자동으로 진행되는
          </span>

          <span className='leading-[24px]'>
            AI 홍보 자동화 서비스
          </span>
        </div>
      </div>

      <div className='px-[25.89px]'>
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

export default Thumbnail