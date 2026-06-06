import yellowError from '../assets/yellow-error.svg'

const AuthFail = () => {
  return (
    <main className='flex h-full flex-col items-center justify-center bg-white px-[25px] pb-[80px]'>
      <img
        className='h-[125px] w-[125px]'
        src={yellowError}
        alt='인증 실패'
      />

      <span className='mt-[28px] text-center font-["Apple_SD_Gothic_Neo"] text-[24px] font-bold leading-[34px] tracking-[-0.5px] text-[var(--common-b,#000)]'>
        인증 실패
      </span>

      <span className='mt-[14px] text-center font-["Apple_SD_Gothic_Neo"] text-[16px] font-medium leading-[16px] tracking-[-0.5px] text-[var(--coolgray-500,#7E858C)]'>
        올리고 앱으로 이동하여 다시 인증메일을 보내주세요!
      </span>
    </main>
  )
}

export default AuthFail
