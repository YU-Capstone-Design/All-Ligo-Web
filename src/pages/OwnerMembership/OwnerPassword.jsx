import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OwnerLoginHeader from '../../components/auth/OwnerLoginHeader'
import AuthButton from '../../components/auth/AuthButton'
import noicon from '../../assets/auth/noicon.svg'
import { signupOwner } from '../../apis/OwnerSignupApi'
import {
  clearOwnerSignupDraft,
  getOwnerSignupDraft,
} from '../../utils/ownerSignupDraft'

const OwnerPassword = () => {
  const navigate = useNavigate()

  // 첫 번째 비밀번호 입력값
  const [password, setPassword] = useState('')

  // 두 번째 비밀번호 확인 입력값
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [signupError, setSignupError] = useState('')
  const [isSigningUp, setIsSigningUp] = useState(false)

  // 비밀번호 길이 조건 현재 6이상 12이하로 설정 -> 12 이상보다 길게도 생각해보기..
  const isPasswordEmpty = password.length === 0
  const isPasswordValid = password.length >= 6 && password.length <= 12

  // 비밀번호 확인 입력 여부
  const isPasswordConfirmEmpty = passwordConfirm.length === 0

  // 비밀번호 일치 여부
  const isPasswordMatched = password === passwordConfirm

  // 다음 버튼 활성화 조건
  const isButtonActive =
    isPasswordValid && !isPasswordConfirmEmpty && isPasswordMatched

  // 다음 버튼 클릭 시 이동 -> 회원가입 완료 페이지
  const handleNextClick = async () => {
    if (!isButtonActive || isSigningUp) return

    const draft = getOwnerSignupDraft()
    const requiredSignupFields = [
      draft.email,
      draft.storeName,
      draft.mapUrl,
      draft.latitude,
      draft.longitude,
      draft.region,
    ]

    if (requiredSignupFields.some((field) => field === undefined || field === null || field === '')) {
      setSignupError('*회원가입 정보가 부족해요. 처음부터 다시 진행해주세요.')
      return
    }

    const signupForm = {
      email: draft.email,
      storeName: draft.storeName,
      mapUrl: draft.mapUrl,
      latitude: draft.latitude,
      longitude: draft.longitude,
      region: draft.region,
      password,
      passwordConfirm,
    }

    try {
      setIsSigningUp(true)
      setSignupError('')
      await signupOwner(signupForm)
      if (draft.address || draft.locationText) {
        localStorage.setItem(
          'mypageStoreLocation',
          draft.address || draft.locationText,
        )
      }
      if (draft.latitude) {
        localStorage.setItem('mypageStoreLatitude', String(draft.latitude))
      }
      if (draft.longitude) {
        localStorage.setItem('mypageStoreLongitude', String(draft.longitude))
      }
      clearOwnerSignupDraft()
      navigate('/success-page')
    } catch (error) {
      const serverMessage = error.response?.data?.message
      setSignupError(
        serverMessage
          ? `*${serverMessage}`
          : '*회원가입에 실패했어요. 입력 정보를 다시 확인해주세요.'
      )
    } finally {
      setIsSigningUp(false)
    }
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <OwnerLoginHeader />

      <div className='text-[24px] pl-[15.89px] font-bold leading-[41px] mt-[12px]'>
        비밀번호를 입력해주세요.
      </div>

      <div className='mt-[24px] flex gap-[24px] px-[15.89px] flex-col'>
        {/*첫 번째 비밀번호 입력*/}
        <div className='flex flex-col'>
          <span className='leading-[20px] text-[12px] text-[#7e858c]'>
            비밀번호
          </span>

          <div className='relative'>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full pr-[40px] text-[28px] leading-[28px] text-black placeholder:text-[#D9D9D9] border-b-[2px] border-[#b4bac0] focus:border-b-[#3182F6] focus:outline-none focus:ring-0'
              type='password'
              placeholder='************'
            />

            {password && (
              <img
                src={noicon}
                alt='입력값 지우기'
                className='absolute right-[6px] top-1/2 -translate-y-1/2 w-[25px] h-[25px] cursor-pointer'
                onClick={() => setPassword('')}
              />
            )}
          </div>

          {(isPasswordEmpty || !isPasswordValid) && (
            <span
              className={`pl-[10px] text-[14px] leading-[20px] mt-[12px] ${
                !isPasswordEmpty && !isPasswordValid
                  ? 'text-[#C74F44]'
                  : 'text-[#62676d]'
              }`}
            >
              *6자 이상, 12자 이하로 입력해주세요.
            </span>
          )}
        </div>

        {/*두 번째 비밀번호 확인 입력*/}
        <div className='flex flex-col'>
          <span className='leading-[20px] text-[12px] text-[#7e858c]'>
            비밀번호
          </span>

          <div className='relative'>
            <input
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className='w-full pr-[40px] text-[28px] leading-[28px] text-black placeholder:text-[#D9D9D9] border-b-[2px] border-[#b4bac0] focus:border-b-[#3182F6] focus:outline-none focus:ring-0'
              type='password'
              placeholder='************'
            />

            {passwordConfirm && (
              <img
                src={noicon}
                alt='입력값 지우기'
                className='absolute right-[6px] top-1/2 -translate-y-1/2 w-[25px] h-[25px] cursor-pointer'
                onClick={() => setPasswordConfirm('')}
              />
            )}
          </div>

          {!isPasswordConfirmEmpty && (
            <span
              className={`pl-[10px] text-[14px] leading-[20px] mt-[12px] ${
                isPasswordMatched ? 'text-[#3B77C1]' : 'text-[#C74F44]'
              }`}
            >
              {isPasswordMatched
                ? '*비밀번호가 확인 되었습니다.'
                : '*비밀번호가 일치하지 않습니다.'}
            </span>
          )}
        </div>
        {signupError && (
          <span className='pl-[10px] text-[14px] leading-[20px] text-[#C74F44]'>
            {signupError}
          </span>
        )}
      </div>

      {/* 다음 버튼 -> 클릭시 회원가입 완료 페이지로 이동 */}
      <div className='mt-auto px-[15.89px] pb-[37px]'>
        <AuthButton isActive={isButtonActive && !isSigningUp} onClick={handleNextClick}>
          {isSigningUp ? '가입 중' : '다음'}
        </AuthButton>
      </div>
    </div>
  )
}

export default OwnerPassword
