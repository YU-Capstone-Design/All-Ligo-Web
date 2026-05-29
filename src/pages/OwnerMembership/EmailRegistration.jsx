import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OwnerSignupHeader from "../../components/auth/OwnerSignupHeader";
import AuthButton from "../../components/auth/AuthButton";
import imageemail from "../../assets/image-email.png";
import imagewarning from "../../assets/image-warning.png";
import { FaArrowRight } from "react-icons/fa6";
import {
  checkEmailDuplicate,
  checkEmailVerificationStatus,
  sendVerificationEmail,
} from "../../apis/EmailCheckApi";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EmailRegistration = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [focusedField, setFocusedField] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [sentEmailError, setSentEmailError] = useState("");
  const [isProcessingEmail, setIsProcessingEmail] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasEmail = email.trim() !== "";
  const isEmailValid = EMAIL_REGEX.test(email.trim());

  const getLineColor = () => {
    if (emailError || focusedField) {
      return "border-[#2880EB]";
    }
    if (hasEmail) {
      return "border-black";
    }
    return "border-[#B8C0C8]";
  };

  const handleEmailChange = (event) => {
    const nextEmail = event.target.value;
    setEmail(nextEmail);
    if (nextEmail.trim() && !EMAIL_REGEX.test(nextEmail.trim())) {
      setEmailError("* 이메일 형식을 맞추어 작성해주세요.");
      return;
    }
    setEmailError("");
  };

  const handleNext = async () => {
    if (isProcessingEmail) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setEmailError("* 이메일 형식을 맞추어 작성해주세요.");
      return;
    }

    try {
      setIsProcessingEmail(true);
      setEmailError("");

      const emailCheckResult = await checkEmailDuplicate(trimmedEmail);

      if (!emailCheckResult?.available) {
        setEmailError("* 이미 등록된 이메일은 사용할 수 없어요.");
        return;
      }

      await sendVerificationEmail(trimmedEmail);
      setIsSent(true);
    } catch (error) {
      if (error.response?.status === 400) {
        setEmailError("* 이메일 형식을 맞추어 작성해주세요.");
        return;
      }

      if (error.response?.status === 409 || error.response?.status === 422) {
        setEmailError("* 이미 등록된 이메일은 사용할 수 없어요.");
        return;
      }

      setEmailError("* 이메일 인증 메일 발송에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsProcessingEmail(false);
    }
  };

  const handleResend = async () => {
    if (isProcessingEmail) return;

    try {
      setIsProcessingEmail(true);
      setSentEmailError("");
      await sendVerificationEmail(email.trim());
    } catch {
      setSentEmailError("* 인증 이메일 재발송에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsProcessingEmail(false);
    }
  };

  const handleComplete = async () => {
    if (isProcessingEmail) return;

    try {
      setIsProcessingEmail(true);
      const statusResult = await checkEmailVerificationStatus(email.trim());

      if (!statusResult?.verified) {
        setIsModalOpen(true);
        return;
      }

      navigate("/owner-store-name");
    } catch (error) {
      if (error.response?.status === 400) {
        alert("유효시간이 끝났어요.");
        return;
      }

      alert("이메일 인증 상태를 확인하지 못했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsProcessingEmail(false);
    }
  };

  if (isSent) {
    return (
      <div className="relative min-h-[100dvh] bg-white flex flex-col">
        <OwnerSignupHeader />

        <section className="flex flex-1 flex-col items-center px-[16px] pt-[147px] text-center">
          <div className="mb-[8px] h-[175px] w-[175px]">
            <img
              src={imageemail}
              alt="Email Sent"
              className="h-full w-full object-contain"
            />
          </div>

          <h1 className="text-[24px] leading-[34px] font-bold text-[#000000]">
            인증 이메일을 보냈어요!
          </h1>
          <p className="mt-[12px] text-[16px] leading-[16px] font-medium text-[#7E858C]">
            메일함에서 '인증완료' 버튼을 눌러 인증해주세요.
          </p>

          <button
            type="button"
            onClick={handleResend}
            disabled={isProcessingEmail}
            className="mt-[23px] flex items-center justify-center gap-[6px] text-[18px] leading-none font-semibold text-[#3182F6]"
          >
            <span>{isProcessingEmail ? "발송 중" : "다시보내기"}</span>
            <span className="flex items-center -translate-y-[2px]">
              <FaArrowRight size={15} />
            </span>
          </button>
          {sentEmailError && (
            <p className="mt-[10px] text-[14px] leading-[20px] font-normal text-[#C74F44]">
              {sentEmailError}
            </p>
          )}
        </section>

        <div className="px-[16px] pb-[calc(54px+env(safe-area-inset-bottom))]">
          <AuthButton isActive={!isProcessingEmail} onClick={handleComplete}>
            {isProcessingEmail ? "확인 중" : "완료"}
          </AuthButton>
        </div>

        {isModalOpen && (
          <div
            className="absolute inset-0 z-20 flex items-end bg-black/55"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="w-full rounded-t-[18px] bg-white px-[16px] pb-[calc(30px+env(safe-area-inset-bottom))] pt-[28px] text-center"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mx-auto h-[60px] w-[70px]">
                <img
                  src={imagewarning}
                  alt="Warning"
                  className="h-[full] w-full object-contain"
                />
              </div>

              <h2 className="mt-[10px] text-[24px] leading-[34px] font-bold text-[#000000]">
                아직 인증이 되지 않았어요!
              </h2>
              <p className="mt-[4px] text-[14px] leading-[16px] font-medium text-[#7E858C]">
                이메일이 오지 않았나요?
              </p>

              <button
                type="button"
                onClick={handleResend}
                disabled={isProcessingEmail}
                className="mt-[22px] flex h-[60px] w-full items-center justify-center gap-[8px] rounded-[15px] bg-[#E8F3FF] text-[16px] leading-[24px] font-medium text-[#3182F6]"
              >
                <span>
                  {isProcessingEmail ? "인증 이메일 발송 중" : "인증 이메일 다시보내기"}
                </span>
                <span className="flex items-center -translate-y-[2px]">
                  <FaArrowRight size={15} />
                </span>
              </button>
              {sentEmailError && (
                <p className="mt-[10px] text-[14px] leading-[20px] font-normal text-[#C74F44]">
                  {sentEmailError}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col">
      <OwnerSignupHeader />

      <section className="px-[16px] pt-[24px]">
        <h1 className="text-[24px] leading-[41px] font-bold text-[#000000]">
          이메일을 입력해주세요.
        </h1>

        <form
          className="mt-[30px]"
          onSubmit={(event) => event.preventDefault()}
        >
          <label
            htmlFor="owner-signup-email"
            className="block text-[12px] leading-[20px] font-medium text-[#7E858C]"
          >
            이메일
          </label>

          <div
            className={`mt-[8px] flex items-center border-b-2 ${getLineColor()}`}
          >
            <input
              id="owner-signup-email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              onFocus={() => setFocusedField(true)}
              onBlur={() => setFocusedField(false)}
              placeholder="djwjfkrh@naver.com"
              className="h-[39px] min-w-0 flex-1 bg-transparent text-[28px] leading-[28px] font-normal text-[#000000] placeholder:text-[#CAD0D6] outline-none"
              autoComplete="email"
            />

            {hasEmail && (
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setEmail("");
                  setEmailError("");
                }}
                className="ml-[8px] flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full bg-[#CAD0D6] text-[18px] leading-none font-bold text-white"
                aria-label="이메일 지우기"
              >
                <span className="translate-y-[1px]">×</span>
              </button>
            )}
          </div>

          {emailError && (
            <p className="mt-[10px] text-[14px] leading-[20px] font-normal text-[#C74F44]">
              {emailError}
            </p>
          )}
        </form>
      </section>

      <div className="mt-auto px-[16px] pb-[calc(54px+env(safe-area-inset-bottom))]">
        <AuthButton isActive={isEmailValid && !isProcessingEmail} onClick={handleNext}>
          {isProcessingEmail ? "발송 중" : "다음"}
        </AuthButton>
      </div>
    </div>
  );
};

export default EmailRegistration;
