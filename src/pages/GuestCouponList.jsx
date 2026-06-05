import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import arrowup from "../assets/arrow-up.svg";
import { getStoreCoupons } from "../apis/GuestCouponApi";

const fallbackCoupons = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  title: "돼지 국밥 오픈 할인",
  discount: "20%",
  type: "할인쿠폰",
}));

const formatDiscount = (coupon) => {
  if (coupon.discountType === "AMOUNT") {
    return `${Number(coupon.discountNum || 0).toLocaleString()}원`;
  }

  return `${coupon.discountNum || 0}%`;
};

const toCouponItem = (coupon) => ({
  id: coupon.couponId,
  title: coupon.menuName,
  discount: formatDiscount(coupon),
  type: "할인쿠폰",
  imageUrl: coupon.imageUrl,
});

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

const CouponImage = ({ imageUrl }) => (
  <div className="h-[84px] w-[84px] shrink-0 overflow-hidden rounded-[16px] bg-[#c8b29d]">
    {imageUrl ? (
      <img
        className="h-full w-full object-cover"
        src={imageUrl}
        alt=""
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    ) : (
      <div className="h-full w-full bg-[radial-gradient(circle_at_54%_54%,#f0eadf_0_16%,#b58b67_17%_29%,#f4eee5_30%_40%,#80614f_41%_53%,#d6c2ac_54%_70%,#9c775c_71%_100%)]" />
    )}
  </div>
);

const CouponCard = ({ coupon }) => (
  <article className="relative flex h-[100px] w-full items-start overflow-hidden rounded-[20px] bg-white p-[8px] shadow-[0_0_20px_rgba(0,0,0,0.06)]">
    <div className="flex min-w-0 items-start gap-[36px] pr-[52px]">
      <CouponImage imageUrl={coupon.imageUrl} />

      <div className="flex h-[84px] min-w-0 flex-1 flex-col justify-between">
        <h2 className="truncate text-[20px] font-bold leading-[28px] text-[#3A3A3A]">
          {coupon.title}
        </h2>
        <div className="flex min-w-0 items-baseline gap-[4px] whitespace-nowrap">
          <span className="shrink-0 text-[34px] font-bold leading-[34px] tracking-[-0.5px] text-[#3182F6]">
            {coupon.discount}
          </span>
          <span className="shrink-0 text-[14px] font-semibold leading-[14px] tracking-[-0.5px] text-black">
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
  const location = useLocation();
  const storeId = location.state?.storeId;
  const storeName = location.state?.storeName || "덤브 치킨 영남대점";
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCoupons = async () => {
      if (!storeId) {
        setCoupons(fallbackCoupons);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await getStoreCoupons(storeId);
        setCoupons(
          Array.isArray(response) ? response.map(toCouponItem) : [],
        );
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ||
            "쿠폰 리스트를 불러오지 못했어요.",
        );
        setCoupons(fallbackCoupons);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoupons();
  }, [storeId]);

  return (
    <div className="no-scrollbar h-[100dvh] overflow-y-auto bg-[#F6F6F8] pb-[24px]">
      <GuestCouponHeader />

      <main className="px-[29px] pt-[24px]">
        <h1 className="text-[20px] font-bold leading-[24px] tracking-[-0.5px] text-black">
          {storeName} 할인 쿠폰이에요!
        </h1>

        <section className="mt-[24px] flex flex-col gap-[16px]">
          {isLoading && (
            <p className="rounded-[20px] bg-white px-[16px] py-[18px] text-[14px] font-normal text-[#7E858C]">
              쿠폰 리스트를 불러오는 중이에요.
            </p>
          )}

          {!isLoading && errorMessage && (
            <p className="rounded-[20px] bg-white px-[16px] py-[18px] text-[14px] font-normal leading-[20px] text-[#E42A2A]">
              {errorMessage}
            </p>
          )}

          {!isLoading && coupons.length === 0 && !errorMessage && (
            <p className="rounded-[20px] bg-white px-[16px] py-[18px] text-[14px] font-normal text-[#7E858C]">
              사용할 수 있는 쿠폰이 없어요.
            </p>
          )}

          {!isLoading && coupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </section>
      </main>
    </div>
  );
};

export default GuestCouponList;
