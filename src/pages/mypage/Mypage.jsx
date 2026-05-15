import { useState } from "react";
import { useNavigate } from "react-router-dom";

const coupons = [
  { id: 1, title: "돼지 국밥 오픈 할인", discount: "20%" },
  { id: 2, title: "돼지 국밥 오픈 할인", discount: "20%" },
  { id: 3, title: "돼지 국밥 오픈 할인", discount: "20%" },
];

const CouponImage = () => (
  <div className="h-[74px] w-[74px] shrink-0 overflow-hidden rounded-[12px] bg-[#d8d0c5]">
    <div className="h-full w-full bg-[radial-gradient(circle_at_48%_42%,#f7eee2_0_13%,#a77d62_14%_27%,#f4e7d7_28%_34%,#6b4a38_35%_44%,#caa58b_45%_58%,#e8dfd5_59%_100%)]" />
  </div>
);

const BottomNav = () => (
  <nav className="fixed bottom-[20px] left-1/2 z-10 flex h-[58px] w-[calc(100%-32px)] max-w-[398px] -translate-x-1/2 items-center justify-around rounded-[28px] bg-white shadow-[0_8px_24px_rgba(35,47,66,0.12)]">
    {[
      ["⌂", "홈", false],
      ["▦", "제품 관리", false],
      ["▤", "대기줄", false],
      ["●", "마이페이지", true],
    ].map(([icon, label, active]) => (
      <button
        key={label}
        type="button"
        className={`flex h-[46px] w-[68px] flex-col items-center justify-center rounded-[24px] text-[10px] font-semibold ${
          active ? "bg-[#E4F0FF] text-[#2880EB]" : "text-[#A7B0B8]"
        }`}
      >
        <span className="text-[20px] leading-[20px]">{icon}</span>
        <span className="mt-[2px]">{label}</span>
      </button>
    ))}
  </nav>
);

const MyPage = () => {
  const navigate = useNavigate();
  const [activeMenuId, setActiveMenuId] = useState(null);

  return (
    <div className="relative min-h-[100dvh] bg-[#F7F8FA] px-[16px] pb-[102px] pt-[52px]">
      <header className="flex items-center justify-between">
        <h1 className="text-[24px] font-bold text-[#2880EB]">All-Ligo</h1>
        <div className="flex items-center gap-[16px] text-[#CAD0D6]">
          <button type="button" aria-label="알림" className="text-[24px]">
            ●
          </button>
          <button type="button" aria-label="설정" className="text-[24px]">
            ⚙
          </button>
        </div>
      </header>

      <section className="mt-[22px] flex flex-col items-center">
        <button
          type="button"
          onClick={() => navigate("/mypage/profile")}
          className="relative h-[96px] w-[96px] rounded-full bg-[radial-gradient(circle_at_42%_34%,#f7c25a_0_14%,#3269a7_15%_34%,#d64536_35%_47%,#11325d_48%_100%)]"
          aria-label="프로필 수정"
        >
          <span className="absolute bottom-[2px] right-[2px] flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#D9E0E6] text-[14px]">
            ✎
          </span>
        </button>
        <h2 className="mt-[12px] text-[22px] font-bold text-black">홍길동</h2>
        <p className="mt-[2px] text-[14px] font-semibold text-[#9DA4AB]">
          #닉네임1234
        </p>
      </section>

      <section className="mt-[28px]">
        <div className="flex items-center gap-[8px] text-[15px] font-bold text-[#5D6670]">
          <span>▣</span>
          <span>쿠폰 관리</span>
        </div>

        <button
          type="button"
          onClick={() => navigate("/mypage/coupons/new")}
          className="mt-[12px] flex h-[48px] w-full items-center justify-center gap-[8px] rounded-[15px] bg-[#2880EB] text-[16px] font-bold text-white"
        >
          <span className="flex h-[20px] w-[20px] items-center justify-center rounded-full border-2 border-white text-[16px] leading-none">
            +
          </span>
          쿠폰 등록하기
        </button>

        <div className="mt-[14px] flex flex-col gap-[12px]">
          {coupons.map((coupon) => (
            <article
              key={coupon.id}
              className="relative flex rounded-[16px] bg-white p-[10px] shadow-[0_8px_20px_rgba(23,35,53,0.08)]"
            >
              <CouponImage />
              <div className="ml-[14px] min-w-0 flex-1">
                <h3 className="truncate text-[17px] font-bold text-[#2A2D31]">
                  {coupon.title}
                </h3>
                <p className="mt-[3px] flex items-end gap-[2px]">
                  <span className="text-[34px] leading-[34px] font-bold text-[#2880EB]">
                    {coupon.discount}
                  </span>
                  <span className="pb-[3px] text-[13px] font-bold text-black">
                    할인쿠폰
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveMenuId(activeMenuId === coupon.id ? null : coupon.id)
                }
                className="absolute right-[12px] top-[8px] text-[22px] leading-none text-[#9DA4AB]"
                aria-label="쿠폰 메뉴"
              >
                ···
              </button>

              {activeMenuId === coupon.id && (
                <div className="absolute right-[4px] top-[34px] z-20 w-[250px] overflow-hidden rounded-[30px] bg-white/95 px-[42px] py-[18px] shadow-[0_14px_40px_rgba(23,35,53,0.18)] backdrop-blur-md">
                  <button
                    type="button"
                    className="flex h-[48px] w-full items-center gap-[18px] text-[20px] font-semibold text-black"
                  >
                    <span
                      className="relative h-[24px] w-[24px] shrink-0"
                      aria-hidden="true"
                    >
                      <span className="absolute left-[3px] top-[5px] h-[16px] w-[16px] rounded-[3px] border-[3px] border-black" />
                      <span className="absolute left-[13px] top-[2px] h-[18px] w-[4px] rotate-45 rounded-full bg-black" />
                    </span>
                    수정하기
                  </button>
                  <div className="my-[10px] h-px w-full bg-[#E4E8EC]" />
                  <button
                    type="button"
                    className="flex h-[48px] w-full items-center gap-[18px] text-[20px] font-semibold text-[#FF2D46]"
                  >
                    <span
                      className="relative h-[24px] w-[24px] shrink-0"
                      aria-hidden="true"
                    >
                      <span className="absolute left-[5px] top-[8px] h-[14px] w-[14px] rounded-[2px] border-[3px] border-[#FF2D46]" />
                      <span className="absolute left-[3px] top-[5px] h-[3px] w-[18px] rounded-full bg-[#FF2D46]" />
                      <span className="absolute left-[8px] top-[2px] h-[4px] w-[8px] rounded-t-[4px] border-x-[3px] border-t-[3px] border-[#FF2D46]" />
                    </span>
                    삭제하기
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <BottomNav />
    </div>
  );
};

export default MyPage;
