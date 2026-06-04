import { useNavigate } from "react-router-dom";
import arrowup from "../assets/arrow-up.svg";

const coupons = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  title: "돼지 국밥 오픈 할인",
  discount: "20%",
  type: "할인쿠폰",
}));

const GuestCouponHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row items-center py-[11px]">
      <button type="button" onClick={() => navigate(-1)} className="pl-[16px]">
        <img src={arrowup} alt="뒤로가기" />
      </button>

      <div className="flex w-[314px] justify-center text-center text-[14px] leading-[20px]">
        쿠폰 리스트
      </div>
    </div>
  );
};

const CouponImage = () => (
  <div className="h-[84px] w-[84px] shrink-0 overflow-hidden rounded-[16px] bg-[#c8b29d]">
    <div className="h-full w-full bg-[radial-gradient(circle_at_54%_54%,#f0eadf_0_16%,#b58b67_17%_29%,#f4eee5_30%_40%,#80614f_41%_53%,#d6c2ac_54%_70%,#9c775c_71%_100%)]" />
  </div>
);

const CouponCard = ({ coupon }) => (
  <article className="relative flex w-full items-start rounded-[20px] bg-white p-[8px] shadow-[0_0_20px_rgba(0,0,0,0.06)]">
    <div className="flex min-w-0 items-start gap-[28px]">
      <CouponImage />

      <div className="min-w-0 max-w-[190px] pt-[8px]">
        <h2 className="truncate text-[20px] font-bold leading-[28px] text-[#3A3A3A]">
          {coupon.title}
        </h2>
        <div className="mt-[10px] flex items-end">
          <span className="text-[40px] font-bold leading-[24px] tracking-[-0.5px] text-[#3182F6]">
            {coupon.discount}
          </span>
          <span className="ml-[4px] text-[14px] font-semibold leading-[14px] tracking-[-0.5px] text-black">
            {coupon.type}
          </span>
        </div>
      </div>
    </div>

    <button
      type="button"
      className="absolute right-[28px] top-[22px] flex h-[12px] w-[26px] items-center justify-center gap-[4px]"
      aria-label="쿠폰 메뉴"
    >
      <span className="h-[2px] w-[2px] rounded-full bg-[#9DA4AB]" />
      <span className="h-[2px] w-[2px] rounded-full bg-[#9DA4AB]" />
      <span className="h-[2px] w-[2px] rounded-full bg-[#9DA4AB]" />
    </button>
  </article>
);

const GuestCouponList = () => {
  return (
    <div className="no-scrollbar h-[100dvh] overflow-y-auto bg-[#F6F6F8] pb-[24px]">
      <GuestCouponHeader />

      <main className="px-[29px] pt-[24px]">
        <h1 className="text-[20px] font-bold leading-[24px] tracking-[-0.5px] text-black">
          덤프 치킨 영남대점 할인 쿠폰이에요!
        </h1>

        <section className="mt-[24px] flex flex-col gap-[16px]">
          {coupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </section>
      </main>
    </div>
  );
};

export default GuestCouponList;
