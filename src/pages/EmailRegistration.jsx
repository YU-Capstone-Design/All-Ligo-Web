import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OwnerSignupHeader from "../components/auth/OwnerSignupHeader";
import AuthButton from "../components/auth/AuthButton";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DUPLICATE_EMAIL = "ehowldpdy@naver.com";

const EmailRegistration = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [focusedField, setFocusedField] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasEmail = email.trim() !== "";
  const isEmailValid = EMAIL_REGEX.test(email.trim());
  const isDuplicateEmail = email.trim().toLowerCase() === DUPLICATE_EMAIL;

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

  const handleNext = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setEmailError("* 이메일 형식을 맞추어 작성해주세요.");
      return;
    }

    if (isDuplicateEmail) {
      setEmailError("* 이미 등록된 이메일은 사용할 수 없어요.");
      return;
    }

    setIsSent(true);
  };

  const handleResend = () => {
    setIsModalOpen(true);
  };

  const handleComplete = () => {
    const isEmailVerified = false;

    if (!isEmailVerified) {
      setIsModalOpen(true);
      return;
    }

    navigate("/owner-store-name");
  };

  if (isSent) {
    return (
      <div className="relative min-h-[100dvh] bg-white flex flex-col">
        <OwnerSignupHeader />

        <section className="flex flex-1 flex-col items-center px-[16px] pt-[147px] text-center">
          <div className="relative h-[92px] w-[92px]">
            <span className="absolute left-[11px] top-[4px] h-[82px] w-[82px] rotate-[-23deg] rounded-[18px] bg-gradient-to-br from-[#26C6FF] via-[#2382F2] to-[#9B6CFF] [clip-path:polygon(0_0,100%_50%,0_100%,24%_53%)]" />
            <span className="absolute left-[27px] top-[36px] h-[14px] w-[45px] rotate-[4deg] rounded-full bg-[#126FDB]" />
          </div>

          <h1 className="mt-[20px] text-[24px] leading-[36px] font-bold text-black">
            인증 이메일을 보냈어요!
          </h1>
          <p className="mt-[8px] text-[14px] leading-[20px] font-semibold text-[#9DA4AB]">
            메일함에서 '인증완료' 버튼을 눌러 인증해주세요.
          </p>

          <button
            type="button"
            onClick={handleResend}
            className="mt-[18px] flex items-center gap-[8px] text-[16px] leading-[24px] font-semibold text-[#2880EB]"
          >
            다시보내기
            <span aria-hidden="true">→</span>
          </button>
        </section>

        <div className="px-[16px] pb-[calc(54px+env(safe-area-inset-bottom))]">
          <AuthButton isActive onClick={handleComplete}>
            완료
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
              <div className="mx-auto flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#8EABC4] text-[24px] font-bold text-white">
                !
              </div>

              <h2 className="mt-[28px] text-[22px] leading-[32px] font-bold text-black">
                아직 인증이 되지 않았어요!
              </h2>
              <p className="mt-[4px] text-[12px] leading-[18px] font-semibold text-[#9DA4AB]">
                이메일이 오지 않았나요?
              </p>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="mt-[22px] flex h-[60px] w-full items-center justify-center gap-[8px] rounded-[15px] bg-[#E4F0FF] text-[16px] leading-[24px] font-semibold text-[#2880EB]"
              >
                인증 이메일 다시보내기
                <span aria-hidden="true">→</span>
              </button>
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
        <h1 className="text-[24px] leading-[36px] font-bold text-black">
          이메일을 입력해주세요.
        </h1>

        <form
          className="mt-[30px]"
          onSubmit={(event) => event.preventDefault()}
        >
          <label
            htmlFor="owner-signup-email"
            className="block text-[12px] leading-[18px] font-semibold text-[#9DA4AB]"
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
              className="h-[39px] min-w-0 flex-1 bg-transparent text-[24px] leading-[36px] font-semibold text-black placeholder:text-[#CAD0D6] outline-none"
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
            <p className="mt-[10px] text-[14px] leading-[20px] font-medium text-[#F06F6B]">
              {emailError}
            </p>
          )}
        </form>
      </section>

      <div className="mt-auto px-[16px] pb-[calc(54px+env(safe-area-inset-bottom))]">
        <AuthButton isActive={isEmailValid} onClick={handleNext}>
          다음
        </AuthButton>
      </div>
    </div>
  );
};

export default EmailRegistration;
