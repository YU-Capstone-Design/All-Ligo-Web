import React from "react";

const AuthButton = ({ isActive, onClick, children = "시작하기" }) => {
  return (
    <button
      type="button"
      disabled={!isActive}
      onClick={onClick}
      className={`
        w-full h-[60px]
        flex justify-center items-center
        rounded-[15px]
        px-[55px] py-[8px]
        text-[18px] leading-[34px] font-normal
        transition-colors

        ${
          isActive
            ? "text-white bg-[#2880EB] cursor-pointer"
            : "text-white bg-[#CAD0D6] cursor-not-allowed"
        }
      `}
    >
      <span>{children}</span>
    </button>
  );
};

export default AuthButton;
