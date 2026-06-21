import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "../../components/BottomNavigation";
import AuthContext from "../../contexts/AuthContext";
import { deleteCoupon, getMyCoupons } from "../../apis/CouponApi";
import { getMyPageInfo } from "../../apis/UserApi";
import loadKakaoMap from "../../utils/loadKakaoMap";

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

const CouponImage = ({ imageUrl }) => (
  <div className="h-[74px] w-[74px] shrink-0 overflow-hidden rounded-[12px] bg-[#d8d0c5]">
    {imageUrl ? (
      <img
        src={imageUrl}
        alt=""
        className="h-full w-full object-cover"
      />
    ) : (
      <div className="h-full w-full bg-[radial-gradient(circle_at_48%_42%,#f7eee2_0_13%,#a77d62_14%_27%,#f4e7d7_28%_34%,#6b4a38_35%_44%,#caa58b_45%_58%,#e8dfd5_59%_100%)]" />
    )}
  </div>
);

const getSavedStoreAddress = () => {
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
};

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [couponList, setCouponList] = useState([]);
  const [isCouponLoading, setIsCouponLoading] = useState(true);
  const [couponError, setCouponError] = useState("");
  const [myPageInfo, setMyPageInfo] = useState(null);
  const [myPageError, setMyPageError] = useState("");
  const [storeAddress, setStoreAddress] = useState(getSavedStoreAddress);

  const formatDiscount = (coupon) => {
    const discountNum = Number(coupon.discountNum || 0);

    if (coupon.discountType === "AMOUNT") {
      return `${discountNum.toLocaleString()}원`;
    }

    return `${discountNum}%`;
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말 이 쿠폰을 삭제하시겠습니까?")) {
      try {
        await deleteCoupon(id);
        setCouponList((prevCoupons) =>
          prevCoupons.filter((coupon) => coupon.couponId !== id)
        );
        setActiveMenuId(null);
      } catch (error) {
        setCouponError(
          error.response?.data?.message || "쿠폰 삭제에 실패했어요."
        );
      }
    }
  };

  const handleLogout = () => {
    logout();
    setIsSettingsOpen(false);
    navigate("/splash");
  };

  useEffect(() => {
    let isMounted = true;

    const loadMyPageInfo = async () => {
      try {
        setMyPageError("");
        const nextMyPageInfo = await getMyPageInfo();

        if (isMounted) {
          setMyPageInfo(nextMyPageInfo);
          if (
            !localStorage.getItem("mypageStoreLocation") &&
            nextMyPageInfo.latitude &&
            nextMyPageInfo.longitude
          ) {
            loadKakaoMap()
              .then(
                (kakao) =>
                  new Promise((resolve) => {
                    const geocoder = new kakao.maps.services.Geocoder();
                    geocoder.coord2Address(
                      nextMyPageInfo.longitude,
                      nextMyPageInfo.latitude,
                      (result, status) => {
                        if (
                          status !== kakao.maps.services.Status.OK ||
                          !result.length
                        ) {
                          resolve("");
                          return;
                        }

                        resolve(
                          result[0].road_address?.address_name ||
                            result[0].address?.address_name ||
                            ""
                        );
                      }
                    );
                  })
              )
              .then((address) => {
                if (!isMounted || !address) return;
                localStorage.setItem("mypageStoreLocation", address);
                setStoreAddress(address);
              })
              .catch(() => {});
          }
        }
      } catch (error) {
        if (isMounted) {
          setMyPageError(
            error.response?.data?.message ||
              "마이페이지 정보를 불러오지 못했어요."
          );
        }
      }
    };

    const loadCoupons = async () => {
      try {
        setIsCouponLoading(true);
        setCouponError("");
        const coupons = await getMyCoupons();
        if (isMounted) {
          setCouponList(Array.isArray(coupons) ? coupons : []);
        }
      } catch (error) {
        if (isMounted) {
          setCouponError(
            error.response?.data?.message || "쿠폰 목록을 불러오지 못했어요."
          );
        }
      } finally {
        if (isMounted) {
          setIsCouponLoading(false);
        }
      }
    };

    loadMyPageInfo();
    loadCoupons();

    return () => {
      isMounted = false;
    };
  }, []);

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
                className="flex h-full w-full items-center gap-[10px] text-[16px] font-semibold leading-none text-[#3A3A3A]"
              >
                <MdOutlineLogout className="shrink-0 text-[21px]" />
                <span>로그아웃</span>
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
          {myPageInfo?.profileImageUrl && (
            <img
              src={myPageInfo.profileImageUrl}
              alt=""
              className="h-full w-full rounded-full object-cover"
            />
          )}
          <span className="absolute bottom-[2px] right-[2px] flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#D9E0E6] text-[14px]">
            <img
              src={pencil}
              alt="연필 아이콘"
              className="w-[16px] h-[16px] object-contain -translate-x-[-1px]"
            />
          </span>
        </button>
        <h2 className="mt-[12px] text-[22px] font-bold text-[#000000]">
          {myPageInfo?.storeName || "가게명"}
        </h2>
        <p className="mt-[2px] max-w-full truncate text-[14px] font-medium text-[#7E858C]">
          {storeAddress}
        </p>
        {myPageError && (
          <p className="mt-[8px] text-[13px] font-medium text-[#DF0024]">
            {myPageError}
          </p>
        )}
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
          className="mt-[12px] inline-flex h-[48px] w-full items-center justify-center gap-[8px] rounded-[20px] bg-[#2272EB] text-center text-[16px] font-bold leading-none text-white"
        >
          <span className="flex h-[27px] w-[27px] shrink-0 items-center justify-center">
            <CiCirclePlus
              className="h-[27px] w-[27px] stroke-[0.8] stroke-current"
              style={{ strokeWidth: "0.8px" }}
            />
          </span>
          <span className="text-center">쿠폰 등록하기</span>
        </button>

        {couponError && (
          <p className="mt-[12px] px-[4px] text-[13px] font-medium text-[#DF0024]">
            {couponError}
          </p>
        )}

        <div className="mt-[14px] flex flex-col gap-[12px]">
          {isCouponLoading && (
            <p className="py-[24px] text-center text-[14px] font-medium text-[#9DA4AB]">
              쿠폰을 불러오는 중입니다.
            </p>
          )}

          {!isCouponLoading && couponList.length === 0 && (
            <p className="py-[24px] text-center text-[14px] font-medium text-[#9DA4AB]">
              등록된 쿠폰이 없습니다.
            </p>
          )}

          {couponList.map((coupon) => (
            <article
              key={coupon.couponId}
              className="relative flex h-[98px] rounded-[16px] bg-white p-[12px] shadow-[0_8px_20px_rgba(23,35,53,0.08)]"
            >
              <CouponImage imageUrl={coupon.imageUrl} />
              <div className="ml-[22px] flex h-[74px] min-w-0 flex-1 flex-col justify-between">
                <h3 className="truncate text-[20px] font-bold text-[#3A3A3A]">
                  {coupon.menuName}
                </h3>
                <p className="flex items-baseline gap-[4px]">
                  <span className="text-[34px] leading-[34px] font-bold text-[#3182F6]">
                    {formatDiscount(coupon)}
                  </span>
                  <span className="text-[14px] font-semibold leading-[14px] text-[#000000]">
                    할인쿠폰
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveMenuId(
                    activeMenuId === coupon.couponId ? null : coupon.couponId
                  )
                }
                className="absolute right-[18px] top-[4px] text-[22px] leading-none text-[#9DA4AB]"
                aria-label="쿠폰 메뉴"
              >
                <HiOutlineDotsHorizontal />
              </button>

              {activeMenuId === coupon.couponId && (
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
                    onClick={() => handleDelete(coupon.couponId)}
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
