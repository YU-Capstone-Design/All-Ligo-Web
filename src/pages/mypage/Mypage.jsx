import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "../../components/BottomNavigation";
import AuthContext from "../../contexts/AuthContext";

import { CiCirclePlus } from "react-icons/ci";
import { MdOutlineLogout } from "react-icons/md";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { PiNotePencil } from "react-icons/pi";
import { FiTrash2 } from "react-icons/fi";

import couponIcon from "../../assets/coupon.png";
import bell from "../../assets/bell.png";
import setup from "../../assets/set-up.png";
import pencil from "../../assets/pencil.png";
import appname from "../../assets/app-name.png";

const CouponImage = () => (
  <div className="h-[74px] w-[74px] shrink-0 overflow-hidden rounded-[12px] bg-[#d8d0c5]">
    <div className="h-full w-full bg-[radial-gradient(circle_at_48%_42%,#f7eee2_0_13%,#a77d62_14%_27%,#f4e7d7_28%_34%,#6b4a38_35%_44%,#caa58b_45%_58%,#e8dfd5_59%_100%)]" />
  </div>
);

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [couponList, setCouponList] = useState([
    { id: 1, title: "돼지 국밥 오픈 할인", discount: "20%" },
    { id: 2, title: "돼지 국밥 오픈 할인", discount: "20%" },
    { id: 3, title: "돼지 국밥 오픈 할인", discount: "20%" },
  ]);

  const storeAddress = useMemo(() => {
    const savedLocation = localStorage.getItem("mypageStoreLocation");

    if (savedLocation) {
      return savedLocation;
    }

    try {
      const signupDraft =
        JSON.parse(sessionStorage.getItem("ownerSignupDraft")) || {};
      return (
        signupDraft.address ||
        signupDraft.locationText ||
        "경북 경산시 대학로 280"
      );
    } catch {
      return "경북 경산시 대학로 280";
    }
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("정말 이 쿠폰을 삭제하시겠습니까?")) {
      setCouponList(couponList.filter((coupon) => coupon.id !== id));
      setActiveMenuId(null);
    }
  };

  const handleLogout = () => {
    logout();
    setIsSettingsOpen(false);
    navigate("/owner-login");
  };

  return (
    <div className="relative min-h-[100dvh] bg-[#F7F8FA] px-[16px] pb-[102px] pt-[10px]">
      <header className="flex items-center justify-between">
        <img
          src={appname}
          alt="앱 이름"
          className="w-[100px] h-[32px] object-contain -translate-y-[2px]"
        />
        <div className="relative flex items-center gap-[16px] text-[#CAD0D6]">
          <button
            type="button"
            onClick={() => navigate("/notifications")}
            aria-label="알림"
            className="text-[24px]"
          >
            <img
              src={bell}
              alt="종 아이콘"
              className="w-[32px] h-[32px] object-contain -translate-y-[2px]"
            />
          </button>
          <button
            type="button"
            onClick={() => setIsSettingsOpen((isOpen) => !isOpen)}
            aria-label="설정"
            className="text-[24px]"
          >
            <img
              src={setup}
              alt="설정 아이콘"
              className="w-[32px] h-[32px] object-contain -translate-y-[2px]"
            />
          </button>
          {isSettingsOpen && (
            <div
              className="absolute right-0 top-[38px] z-30 flex h-[50px] w-[190px] items-center rounded-full border border-white/30 bg-white/25 px-[18px] shadow-[0_8px_20px_rgba(23,35,53,0.08)]"
              style={{
                WebkitBackdropFilter: "blur(2px)",
                backdropFilter: "blur(2px)",
              }}
            >
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-full w-full items-center gap-[10px] text-[16px] font-semibold text-[#3A3A3A]"
              >
                <MdOutlineLogout className="text-[21px] translate-y-[-2px]" />
                로그아웃
              </button>
            </div>
          )}
        </div>
      </header>

      <section className="mt-[36px] flex flex-col items-center">
        <button
          type="button"
          onClick={() => navigate("/mypage/profile")}
          className="relative h-[116px] w-[116px] rounded-full bg-[radial-gradient(circle_at_42%_34%,#f7c25a_0_14%,#3269a7_15%_34%,#d64536_35%_47%,#11325d_48%_100%)]"
          aria-label="프로필 수정"
        >
          <span className="absolute bottom-[2px] right-[2px] flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#D9E0E6] text-[14px]">
            <img
              src={pencil}
              alt="연필 아이콘"
              className="w-[16px] h-[16px] object-contain -translate-x-[-1px]"
            />
          </span>
        </button>
        <h2 className="mt-[12px] text-[22px] font-bold text-[#000000]">
          홍길동
        </h2>
        <p className="mt-[2px] max-w-full truncate text-[14px] font-medium text-[#7E858C]">
          {storeAddress}
        </p>
      </section>

      <section className="mt-[28px]">
        <div className="flex items-center gap-[8px] ml-[10px] text-[18px] font-bold text-[#7E858C]">
          <img
            src={couponIcon}
            alt="쿠폰 아이콘"
            className="w-[20px] h-[20px] object-contain -translate-y-[2px]"
          />
          <span>쿠폰 관리</span>
        </div>

        <button
          type="button"
          onClick={() => navigate("/mypage/coupons/new")}
          className="mt-[12px] flex h-[48px] w-full items-center justify-center gap-[8px] rounded-[20px] bg-[#2272EB] text-[16px] font-bold text-white"
        >
          <span className="flex items-center justify-center text-[16px] font-bold leading-none">
            <CiCirclePlus
              className="w-[27px] h-[27px] stroke-[0.8] stroke-current -translate-y-[2px]"
              style={{ strokeWidth: "0.8px" }}
            />
          </span>
          쿠폰 등록하기
        </button>

        <div className="mt-[14px] flex flex-col gap-[12px]">
          {couponList.map((coupon) => (
            <article
              key={coupon.id}
              className="relative flex rounded-[16px] bg-white p-[12px] shadow-[0_8px_20px_rgba(23,35,53,0.08)]"
            >
              <CouponImage />
              <div className="ml-[14px] min-w-0 flex-1">
                <h3 className="truncate text-[20px] font-bold text-[#3A3A3A]">
                  {coupon.title}
                </h3>
                <p className="mt-[3px] flex items-end gap-[2px]">
                  <span className="text-[40px] leading-[42px] font-bold text-[#3182F6]">
                    {coupon.discount}
                  </span>
                  <span className="pb-[3px] text-[14px] font-semibold text-[#000000]">
                    할인쿠폰
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveMenuId(activeMenuId === coupon.id ? null : coupon.id)
                }
                className="absolute right-[18px] top-[4px] text-[22px] leading-none text-[#9DA4AB]"
                aria-label="쿠폰 메뉴"
              >
                <HiOutlineDotsHorizontal />
              </button>

              {activeMenuId === coupon.id && (
                <div
                  className="absolute right-0 top-[30px] z-20 w-[230px] overflow-hidden rounded-[20px] border border-white/30 bg-white/25 py-[8px] shadow-[0_8px_20px_rgba(23,35,53,0.08)]"
                  style={{
                    WebkitBackdropFilter: "blur(2px)",
                    backdropFilter: "blur(2px)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/mypage/coupons/modify", { state: { coupon } })
                    }
                    className="flex h-[40px] w-full items-center justify-start gap-[10px] px-[16px] text-[15px] font-medium text-black active:bg-gray-100/50"
                  >
                    <span className="text-[18px] -translate-y-[2px]">
                      <PiNotePencil />
                    </span>
                    수정하기
                  </button>

                  <div className="mx-[16px] h-px bg-black/5" />

                  <button
                    type="button"
                    onClick={() => handleDelete(coupon.id)}
                    className="flex h-[40px] w-full items-center justify-start gap-[10px] px-[16px] text-[15px] font-medium text-[#FF2D46] active:bg-gray-100/50"
                  >
                    <span className="text-[18px] -translate-y-[2px]">
                      <FiTrash2 />
                    </span>
                    삭제하기
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
      <BottomNavigation />
    </div>
  );
};

export default MyPage;
