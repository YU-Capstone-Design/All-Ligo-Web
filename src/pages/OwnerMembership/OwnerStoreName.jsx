import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OwnerSignupHeader from "../../components/auth/OwnerSignupHeader";
import AuthButton from "../../components/auth/AuthButton";
import { updateOwnerSignupDraft } from "../../utils/ownerSignupDraft";

const OwnerStoreName = () => {
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const hasStoreName = storeName.trim() !== "";

  const getLineColor = () => {
    if (isFocused) {
      return "border-[#2880EB]";
    }

    if (hasStoreName) {
      return "border-black";
    }

    return "border-[#B8C0C8]";
  };

  const handleNext = () => {
    if (!hasStoreName) {
      return;
    }

    updateOwnerSignupDraft({ storeName: storeName.trim() });
    navigate("/owner-store-link");
  };

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col">
      <OwnerSignupHeader />

      <section className="px-[16px] pt-[24px]">
        <h1 className="text-[24px] leading-[41px] font-bold text-[#000000]">
          가게명을 입력해주세요.
        </h1>

        <form
          className="mt-[44px]"
          onSubmit={(event) => event.preventDefault()}
        >
          <label
            htmlFor="owner-store-name"
            className="block text-[12px] leading-[20px] font-medium text-[#7E858C]"
          >
            가게명
          </label>

          <div
            className={`mt-[8px] flex items-center border-b-2 ${getLineColor()}`}
          >
            <input
              id="owner-store-name"
              type="text"
              value={storeName}
              onChange={(event) => setStoreName(event.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="ex) 장군제육"
              className="h-[39px] min-w-0 flex-1 bg-transparent text-[28px] leading-[28px] font-normal text-[#000000] placeholder:text-[#CAD0D6] outline-none"
              autoComplete="organization"
            />

            {hasStoreName && (
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => setStoreName("")}
                className="ml-[8px] flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full bg-[#CAD0D6] text-[18px] leading-none font-bold text-white"
                aria-label="가게명 지우기"
              >
                <span className="translate-y-[1px]">×</span>
              </button>
            )}
          </div>
        </form>
      </section>

      <div className="mt-auto px-[16px] pb-[calc(54px+env(safe-area-inset-bottom))]">
        <AuthButton isActive={hasStoreName} onClick={handleNext}>
          다음
        </AuthButton>
      </div>
    </div>
  );
};

export default OwnerStoreName;
