import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OwnerSignupHeader from "../components/auth/OwnerSignupHeader";
import AuthButton from "../components/auth/AuthButton";

const URL_REGEX = /^(https?:\/\/)([\w-]+\.)+[\w-]+(\/.*)?$/i;

const OwnerStoreLink = () => {
  const navigate = useNavigate();
  const [storeLink, setStoreLink] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [linkError, setLinkError] = useState("");

  const hasStoreLink = storeLink.trim() !== "";

  const getLineColor = () => {
    if (linkError || isFocused) {
      return "border-[#2880EB]";
    }

    if (hasStoreLink) {
      return "border-black";
    }

    return "border-[#B8C0C8]";
  };

  const handleLinkChange = (event) => {
    const nextLink = event.target.value;

    setStoreLink(nextLink);

    if (nextLink.trim() && !URL_REGEX.test(nextLink.trim())) {
      setLinkError("*올바른 링크 형식으로 입력해주세요.");
      return;
    }

    setLinkError("");
  };

  const handleNext = () => {
    const trimmedLink = storeLink.trim();

    if (!trimmedLink) {
      return;
    }

    if (!URL_REGEX.test(trimmedLink)) {
      setLinkError("*올바른 링크 형식으로 입력해주세요.");
      return;
    }

    navigate("/owner-store-location");
  };

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col">
      <OwnerSignupHeader />

      <section className="px-[16px] pt-[24px]">
        <h1 className="text-[24px] leading-[41px] font-bold text-[#000000]">
          홍보할 가게 링크를 입력해주세요
        </h1>

        <p className="mt-[16px] text-[16px] leading-[24px] font-medium text-[#7E858C]">
          웹사이트나 지도 링크를 입력하면
          <br />
          AI가 가게 정보를 분석해 대신 홍보해드릴게요.
        </p>

        <form
          className="mt-[34px]"
          onSubmit={(event) => event.preventDefault()}
        >
          <label
            htmlFor="owner-store-link"
            className="block text-[12px] leading-[20px] font-medium text-[#7E858C]"
          >
            링크
          </label>

          <div
            className={`mt-[8px] flex items-center border-b-2 ${getLineColor()}`}
          >
            <input
              id="owner-store-link"
              type="url"
              value={storeLink}
              onChange={handleLinkChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="ex) 네이버 지도 링크"
              className="h-[39px] min-w-0 flex-1 bg-transparent text-[28px] leading-[28px] font-normal text-[#000000] placeholder:text-[#CAD0D6] outline-none"
              autoComplete="url"
            />

            {hasStoreLink && (
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setStoreLink("");
                  setLinkError("");
                }}
                className="ml-[8px] flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full bg-[#CAD0D6] text-[18px] leading-none font-bold text-white"
                aria-label="링크 지우기"
              >
                <span className="translate-y-[1px]">×</span>
              </button>
            )}
          </div>

          {linkError && (
            <p className="mt-[10px] text-[14px] leading-[20px] font-normal text-[#C74F44]">
              {linkError}
            </p>
          )}
        </form>
      </section>

      <div className="mt-auto px-[16px] pb-[calc(54px+env(safe-area-inset-bottom))]">
        <AuthButton isActive={hasStoreLink} onClick={handleNext}>
          다음
        </AuthButton>
      </div>
    </div>
  );
};

export default OwnerStoreLink;
