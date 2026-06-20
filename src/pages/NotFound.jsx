import { TfiReload } from "react-icons/tfi";
import yellowError from "../assets/yellow-error.svg";

const NotFound = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <main className="flex h-full flex-col items-center bg-white px-[24px] pt-[32dvh] text-center">
      <img
        className="h-[125px] w-[125px]"
        src={yellowError}
        alt=""
        aria-hidden="true"
      />

      <h1 className="mt-[28px] text-[24px] font-bold leading-[24px] tracking-[-0.5px] text-[#000000]">
        앗, 로딩에 실패했어요.
      </h1>

      <p className="mt-[14px] text-[16px] font-medium leading-[16px] tracking-[-0.5px] text-[#7E858C]">
        알수 없는 오류가 발생했어요.
      </p>

      <button
        type="button"
        onClick={handleRefresh}
        className="mt-[26px] inline-flex items-center gap-[8px] text-[18px] font-medium leading-[18px] tracking-[-0.5px] text-[#3182F6] active:scale-95"
      >
        새로고침
        <TfiReload className="rotate-90 text-[18px]" aria-hidden="true" />
      </button>
    </main>
  );
};

export default NotFound;
