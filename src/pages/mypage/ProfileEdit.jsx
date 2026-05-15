import { useState } from "react";
import { useNavigate } from "react-router-dom";
import arrowup from "../../assets/arrow-up.svg";
import AuthButton from "../../components/auth/AuthButton";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState("가나다라마바사");
  const [storeLink, setStoreLink] = useState("www.naver.com");
  const [storeLocation] = useState(
    () =>
      localStorage.getItem("mypageStoreLocation") || "경북 경산시 대학교 280"
  );
  const [detailAddress, setDetailAddress] = useState(
    () => localStorage.getItem("mypageStoreLocationDetail") || "A06 미술대학"
  );
  const [isLinkInvalid, setIsLinkInvalid] = useState(false);

  const handleSubmit = () => {
    setIsLinkInvalid(
      !/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/.*)?$/i.test(storeLink.trim())
    );
  };

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col">
      <header className="flex items-center py-[11px]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="pl-[16px]"
        >
          <img src={arrowup} alt="뒤로가기" />
        </button>
        <div className="w-[314px] text-center text-[14px] leading-[20px]">
          프로필 수정
        </div>
      </header>

      <section className="px-[16px] pt-[28px]">
        <div className="relative mx-auto h-[96px] w-[96px] rounded-full bg-[radial-gradient(circle_at_42%_34%,#f7c25a_0_14%,#3269a7_15%_34%,#d64536_35%_47%,#11325d_48%_100%)]">
          <span className="absolute bottom-[2px] right-[2px] flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#D9E0E6] text-[14px]">
            ✎
          </span>
        </div>

        <div className="mt-[38px] space-y-[24px]">
          <label className="block">
            <span className="text-[14px] font-semibold text-[#5D6670]">
              가게 이름
            </span>
            <input
              value={storeName}
              onChange={(event) => setStoreName(event.target.value)}
              placeholder="가게 이름을 입력해주세요"
              className="mt-[10px] h-[56px] w-full rounded-[10px] bg-[#F7F8FA] px-[16px] text-[15px] font-semibold outline-none placeholder:text-[#C1C7CE]"
            />
          </label>

          <label className="block">
            <span className="text-[14px] font-semibold text-[#5D6670]">
              가게 링크
            </span>
            <div className="mt-[10px] flex h-[56px] items-center gap-[10px] rounded-[10px] bg-[#F7F8FA] px-[16px]">
              <span className="text-[22px]">🔗</span>
              <input
                value={storeLink}
                onChange={(event) => {
                  setStoreLink(event.target.value);
                  setIsLinkInvalid(false);
                }}
                className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold outline-none"
              />
            </div>
            {isLinkInvalid && (
              <p className="mt-[8px] text-[13px] font-semibold text-[#F06F6B]">
                링크가 유효하지 않습니다.
              </p>
            )}
          </label>

          <button
            type="button"
            onClick={() => navigate("/mypage/location")}
            className="block w-full text-left"
          >
            <span className="text-[14px] font-semibold text-[#5D6670]">
              가게 위치
            </span>
            <div className="mt-[10px] flex h-[56px] items-center gap-[10px] rounded-[10px] bg-[#F7F8FA] px-[16px]">
              <LocationPinIcon />
              <span className="text-[15px] font-semibold text-[#2A2D31]">
                {storeLocation}
              </span>
            </div>
          </button>

          <label className="block">
            <input
              value={detailAddress}
              onChange={(event) => setDetailAddress(event.target.value)}
              placeholder="상세주소를 입력해주세요"
              className="h-[56px] w-full rounded-[10px] bg-[#F7F8FA] px-[16px] text-[15px] font-semibold outline-none placeholder:text-[#C1C7CE]"
            />
          </label>
        </div>
      </section>

      <div className="mt-auto px-[16px] pb-[calc(54px+env(safe-area-inset-bottom))]">
        <AuthButton isActive onClick={handleSubmit}>
          수정하기
        </AuthButton>
      </div>
    </div>
  );
};

const LocationPinIcon = () => (
  <span className="relative h-[24px] w-[24px] shrink-0" aria-hidden="true">
    <span className="absolute left-[4px] top-[2px] h-[16px] w-[16px] rotate-45 rounded-[50%_50%_50%_8px] bg-[#2880EB]" />
    <span className="absolute left-[9px] top-[7px] h-[6px] w-[6px] rounded-full bg-white" />
  </span>
);

export default ProfileEdit;
