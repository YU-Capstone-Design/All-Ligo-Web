import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import OwnerLoginHeader from "../components/auth/OwnerLoginHeader";
import AuthButton from "../components/auth/AuthButton";

const OwnerLogin = () => {
  const navigate = useNavigate();
  const passwordInputRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [hasError, setHasError] = useState(false);

  const getLineColor = (field) => {
    const fieldValue = field === "email" ? email : password;

    if (hasError) {
      return "border-black";
    }

    if (focusedField === field) {
      return "border-[#3182F6]";
    }

    return fieldValue ? "border-black" : "border-[#B4BAC0]";
  };

  const handleSubmit = () => {
    if (email.trim() === "" || password.trim() === "") {
      return;
    }
    setHasError(true);
  };

  const updatePassword = (
    nextPassword,
    cursorPosition = nextPassword.length
  ) => {
    setPassword(nextPassword);
    setHasError(false);

    requestAnimationFrame(() => {
      passwordInputRef.current?.setSelectionRange(
        cursorPosition,
        cursorPosition
      );
    });
  };

  const replaceSelectedPasswordText = (text) => {
    const input = passwordInputRef.current;
    const start = input?.selectionStart ?? password.length;
    const end = input?.selectionEnd ?? password.length;
    const nextPassword = `${password.slice(0, start)}${text}${password.slice(
      end
    )}`;

    updatePassword(nextPassword, start + text.length);
  };

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col">
      <OwnerLoginHeader />

      <section className="px-[16px] pt-[24px]">
        <h1 className="text-[24px] leading-[36px] font-bold text-[#000000]">
          All-Ligo와 다시한번
          <br />
          우리가게를 자동으로 홍보해요!
        </h1>

        <form
          className="mt-[30px]"
          onSubmit={(event) => event.preventDefault()}
        >
          <div>
            <label
              htmlFor="owner-email"
              className="block text-[12px] leading-[20px] font-medium text-[#7E858C]"
            >
              이메일
            </label>

            <div
              className={`mt-[8px] flex items-center border-b-2 ${getLineColor(
                "email"
              )}`}
            >
              <input
                id="owner-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setHasError(false);
                }}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="djwjfkrh@naver.com"
                className="h-[39px] min-w-0 flex-1 bg-transparent text-[28px] leading-[28px] font-normal text-black placeholder:text-[#CAD0D6] outline-none"
                autoComplete="email"
              />

              {email && focusedField === "email" && !hasError && (
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    setEmail("");
                    setHasError(false);
                  }}
                  className="ml-[8px] flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full bg-[#CAD0D6] text-[18px] leading-none font-bold text-white"
                  aria-label="이메일 지우기"
                >
                  <span className="translate-y-[1px]">×</span>
                </button>
              )}
            </div>
          </div>

          <div className="mt-[22px]">
            <label
              htmlFor="owner-password"
              className="block text-[12px] leading-[20px] font-medium text-[#7E858C]"
            >
              비밀번호
            </label>

            <div
              className={`mt-[8px] flex items-center border-b-2 ${getLineColor(
                "password"
              )}`}
            >
              <input
                ref={passwordInputRef}
                id="owner-password"
                type="text"
                value={"*".repeat(password.length)}
                onBeforeInput={(event) => {
                  event.preventDefault();
                  replaceSelectedPasswordText(event.data ?? "");
                }}
                onKeyDown={(event) => {
                  const input = passwordInputRef.current;
                  const start = input?.selectionStart ?? password.length;
                  const end = input?.selectionEnd ?? password.length;

                  if (event.key === "Backspace") {
                    event.preventDefault();
                    if (start !== end) {
                      updatePassword(
                        `${password.slice(0, start)}${password.slice(end)}`,
                        start
                      );
                      return;
                    }
                    if (start > 0) {
                      updatePassword(
                        `${password.slice(0, start - 1)}${password.slice(end)}`,
                        start - 1
                      );
                    }
                  }

                  if (event.key === "Delete") {
                    event.preventDefault();
                    if (start !== end) {
                      updatePassword(
                        `${password.slice(0, start)}${password.slice(end)}`,
                        start
                      );
                      return;
                    }
                    if (start < password.length) {
                      updatePassword(
                        `${password.slice(0, start)}${password.slice(
                          start + 1
                        )}`,
                        start
                      );
                    }
                  }
                }}
                onPaste={(event) => {
                  event.preventDefault();
                  replaceSelectedPasswordText(
                    event.clipboardData.getData("text")
                  );
                }}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                placeholder="**********"
                className="h-[39px] min-w-0 flex-1 bg-transparent text-[28px] leading-[28px] font-bold text-black placeholder:text-[#CAD0D6] outline-none"
                autoComplete="current-password"
              />

              {password && focusedField === "password" && !hasError && (
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    setPassword("");
                    setHasError(false);
                  }}
                  className="ml-[8px] flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full bg-[#CAD0D6] text-[18px] leading-none font-bold text-white"
                  aria-label="비밀번호 지우기"
                >
                  <span className="translate-y-[1px]">×</span>
                </button>
              )}
            </div>
          </div>

          {hasError && (
            <p className="mt-[10px] text-[14px] leading-[20px] font-normal text-[#C74F44]">
              * 아이디 또는 비밀번호가 일치하지 않습니다.
            </p>
          )}

          <div className="mt-[32px] flex justify-center text-[14px] leading-[20px] font-medium text-[#7E858C]">
            <span>처음 방문하시나요?</span>
            <button
              type="button"
              onClick={() => navigate("/email-registration")}
              className="ml-[8px] text-[#3182F6] underline underline-offset-4"
            >
              회원가입
            </button>
          </div>
        </form>
      </section>

      <div className="mt-auto px-[16px] pb-[calc(54px+env(safe-area-inset-bottom))]">
        <AuthButton isActive onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default OwnerLogin;
