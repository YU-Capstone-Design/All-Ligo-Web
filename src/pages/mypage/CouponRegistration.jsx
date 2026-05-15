import { useState } from "react";
import { useNavigate } from "react-router-dom";
import arrowup from "../../assets/arrow-up.svg";
import AuthButton from "../../components/auth/AuthButton";

const PageHeader = ({ title }) => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center py-[11px]">
      <button type="button" onClick={() => navigate(-1)} className="pl-[16px]">
        <img src={arrowup} alt="뒤로가기" />
      </button>
      <div className="w-[314px] text-center text-[14px] leading-[20px]">
        {title}
      </div>
    </header>
  );
};

const CouponRegistration = () => {
  const [menuName, setMenuName] = useState("");
  const [discountRate, setDiscountRate] = useState("");
  const canSubmit = menuName.trim() !== "" && discountRate.trim() !== "";

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col">
      <PageHeader title="쿠폰 등록하기" />

      <section className="px-[16px] pt-[28px]">
        <button
          type="button"
          className="mx-auto flex h-[176px] w-[176px] flex-col items-center justify-center rounded-[28px] border border-[#EEF1F4] bg-[#FBFCFD] text-[#9DA4AB]"
        >
          <span className="text-[42px]">▣</span>
          <span className="mt-[12px] text-center text-[12px] font-semibold leading-[18px]">
            쿠폰에 사용할
            <br />
            이미지를 등록해주세요
          </span>
        </button>

        <label
          className="mt-[48px] block text-[14px] font-semibold text-[#5D6670]"
          htmlFor="coupon-menu-name"
        >
          메뉴명
        </label>
        <input
          id="coupon-menu-name"
          value={menuName}
          onChange={(event) => setMenuName(event.target.value)}
          placeholder="할인할 메뉴 이름을 입력해주세요"
          className="mt-[12px] h-[56px] w-full rounded-[10px] bg-[#F7F8FA] px-[16px] text-[15px] font-semibold outline-none placeholder:text-[#C1C7CE]"
        />

        <label
          className="mt-[28px] block text-[14px] font-semibold text-[#5D6670]"
          htmlFor="coupon-discount-rate"
        >
          할인율
        </label>
        <div className="mt-[12px] flex h-[56px] items-center rounded-[10px] bg-[#F7F8FA] px-[16px]">
          <span className="mr-[8px] text-[22px] font-bold text-[#9DA4AB]">
            %
          </span>
          <input
            id="coupon-discount-rate"
            value={discountRate}
            onChange={(event) =>
              setDiscountRate(event.target.value.replace(/[^0-9]/g, ""))
            }
            placeholder="할인율을 입력해주세요"
            inputMode="numeric"
            className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold outline-none placeholder:text-[#C1C7CE]"
          />
        </div>
      </section>

      <div className="mt-auto px-[16px] pb-[calc(54px+env(safe-area-inset-bottom))]">
        <AuthButton isActive={canSubmit}>등록하기</AuthButton>
      </div>
    </div>
  );
};

export default CouponRegistration;
