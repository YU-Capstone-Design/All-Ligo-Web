import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaDollarSign } from "react-icons/fa6";
import { FaCamera } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";
import AuthButton from "../auth/AuthButton";

const discountOptions = [
  { id: "rate", label: "할인율", icon: "%", placeholder: "할인율을 입력해주세요" },
  {
    id: "price",
    label: "할인가격",
    icon: FaDollarSign,
    placeholder: "할인가격을 입력해주세요",
  },
];

const DiscountIcon = ({ icon }) => {
  const Icon = icon;

  return (
    <span className="flex h-[22px] w-[22px] items-center justify-center text-[18px] font-medium leading-none">
      {typeof icon === "string" ? icon : <Icon className="text-[18px]" />}
    </span>
  );
};

const PageHeader = ({ title }) => {
  const navigate = useNavigate();

  return (
    <header className="relative flex h-[72px] items-center justify-center">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute left-[0px] flex h-[40px] w-[40px] items-center justify-center"
        aria-label="뒤로가기"
      >
        <IoChevronBack className="text-[26px] text-[#B8C0C8]" />
      </button>
      <h1 className="text-[13px] font-medium text-[#424950]">{title}</h1>
    </header>
  );
};

const DiscountOptionButton = ({ option, isSelected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex h-[51px] flex-1 items-center gap-[12px] rounded-[8px] px-[15px] text-left transition-colors ${
      isSelected
        ? "bg-[#E8F3FF] text-[#3182F6]"
        : "bg-[#F6F6F8] text-[#B4BAC0]"
    }`}
  >
    <DiscountIcon icon={option.icon} />
    <span className="text-[15px] font-medium">{option.label}</span>
  </button>
);

const CouponFormPage = ({ title, submitLabel, requireImage = false }) => {
  const fileInputRef = useRef(null);
  const [menuName, setMenuName] = useState("");
  const [discountType, setDiscountType] = useState("rate");
  const [discountValue, setDiscountValue] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const selectedOption = discountOptions.find(
    (option) => option.id === discountType
  );
  const canSubmit =
    menuName.trim() !== "" &&
    discountValue.trim() !== "" &&
    (!requireImage || imagePreview !== null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setImagePreview(URL.createObjectURL(file));
  };

  const handleDiscountTypeChange = (nextType) => {
    setDiscountType(nextType);
    setDiscountValue("");
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white px-[16px]">
      <PageHeader title={title} />

      <main className="flex-1 pt-[20px]">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mx-auto flex h-[160px] w-[160px] flex-col items-center justify-center overflow-hidden rounded-[26px] border border-[#EEF1F4] bg-[#FBFCFD] text-[#AAB2BC]"
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="선택된 쿠폰 이미지"
              className="h-full w-full object-cover"
            />
          ) : (
            <>
              <FaCamera className="text-[36px]" />
              <span className="mt-[12px] text-center text-[13px] font-medium leading-[17px] text-[#AAB2BC]">
                쿠폰에 사용될
                <br />
                이미지를 등록해주세요
              </span>
            </>
          )}
        </button>

        <label
          htmlFor="coupon-menu-name"
          className="mt-[38px] block text-[13px] font-medium leading-[20px] text-[#424950]"
        >
          메뉴명
        </label>
        <input
          id="coupon-menu-name"
          value={menuName}
          onChange={(event) => setMenuName(event.target.value)}
          placeholder="할인할 메뉴 이름을 입력해주세요"
          className="mt-[10px] h-[50px] w-full rounded-[8px] bg-[#F7F8FA] px-[16px] text-[15px] font-medium text-[#111111] outline-none placeholder:text-[#B4BAC0]"
        />

        <p className="mt-[22px] text-[13px] font-medium leading-[20px] text-[#424950]">
          할인
        </p>
        <div className="mt-[10px] grid grid-cols-2 gap-[8px]">
          {discountOptions.map((option) => (
            <DiscountOptionButton
              key={option.id}
              option={option}
              isSelected={discountType === option.id}
              onClick={() => handleDiscountTypeChange(option.id)}
            />
          ))}
        </div>

        <div className="mt-[8px] flex h-[50px] items-center rounded-[8px] bg-[#F7F8FA] px-[16px]">
          <span className="mr-[12px] text-[#9DA4AB]">
            <DiscountIcon icon={selectedOption.icon} />
          </span>
          <input
            value={discountValue}
            onChange={(event) =>
              setDiscountValue(event.target.value.replace(/[^0-9]/g, ""))
            }
            placeholder={selectedOption.placeholder}
            inputMode="numeric"
            className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-[#111111] outline-none placeholder:text-[#B4BAC0]"
          />
        </div>
      </main>

      <div className="pb-[calc(22px+env(safe-area-inset-bottom))]">
        <AuthButton isActive={canSubmit}>{submitLabel}</AuthButton>
      </div>
    </div>
  );
};

export default CouponFormPage;
