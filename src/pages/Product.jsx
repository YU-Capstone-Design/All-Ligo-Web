import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoAdd } from "react-icons/io5";
import BottomNavigation from "../components/BottomNavigation";
import ProductCard from "../components/product/ProductCard";
import appname from "../assets/app-name.png";
import bell from "../assets/bell.png";
import calendar from "../assets/calendar.svg";
import { getMyPromotions } from "../apis/PromotionApi";

const contentTypeLabelMap = {
  BLOG: "블로그",
  VIDEO: "쇼츠",
};

const formatPromotionDate = (dateValue) => {
  if (!dateValue) return "";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "";

  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const weekday = weekdays[date.getDay()];

  return `${year}. ${month}. ${day}. ${weekday}`;
};

const Product = () => {
  const navigate = useNavigate();
  const [productItems, setProductItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const promotions = await getMyPromotions();
        setProductItems(Array.isArray(promotions) ? promotions : []);
      } catch (error) {
        setErrorMessage(
          error.response?.status === 401
            ? "로그인이 만료되었어요. 다시 로그인 후 확인해주세요."
            : error.response?.data?.message ||
                "등록된 홍보페이지를 불러오지 못했어요.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="no-scrollbar h-[100dvh] overflow-y-auto bg-[#F3F4F6] px-[22px] pb-[130px]">
      <header className="flex items-center justify-between py-[7px]">
        <img className="h-[24.383px] w-[88.685px]" src={appname} alt="All-Ligo" />
        <button
          type="button"
          onClick={() => navigate("/notifications")}
          className="flex h-[40px] w-[40px] items-center justify-center"
          aria-label="알림"
        >
          <img className="h-[28px] w-[28px]" src={bell} alt="" />
        </button>
      </header>

      <main className="mt-[46px]">
        <section className="flex h-[42px] items-center gap-[4px]">
          <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center">
            <img
              className="h-[42px] w-[42px]"
              src={calendar}
              alt="캘린더"
            />
          </div>

          <span className="flex h-[42px] items-center text-[20px] font-semibold leading-none text-black">
            등록된 홍보페이지가{" "}
            <span className="font-bold text-[#3182F6]">
              &nbsp;{productItems.length}개
            </span>{" "}
            &nbsp;있어요!
          </span>
        </section>

        <div className="mt-[4.5px] flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/makepage")}
            className="flex h-[45px] items-center gap-[8px] rounded-[555px] bg-white pl-[19.5px] pr-[18.68px] text-[16px] font-medium text-black leading-[20px]"
          >
            추가 등록
            <IoAdd className="text-[25px] text-[#2880EB]" />
          </button>
        </div>

        <section className="mt-[14px] space-y-[14px]">
          {isLoading && (
            <p className="rounded-[16px] bg-white px-[16px] py-[20px] text-[15px] font-medium text-[#7e858c]">
              등록된 홍보페이지를 불러오는 중이에요.
            </p>
          )}

          {!isLoading && errorMessage && (
            <p className="rounded-[16px] bg-white px-[16px] py-[20px] text-[15px] font-medium leading-[22px] text-[#ED0404]">
              {errorMessage}
            </p>
          )}

          {!isLoading && !errorMessage && productItems.length === 0 && (
            <p className="rounded-[16px] bg-white px-[16px] py-[20px] text-[15px] font-medium leading-[22px] text-[#7e858c]">
              아직 등록된 홍보페이지가 없어요.
            </p>
          )}

          {!isLoading &&
            !errorMessage &&
            productItems.map((item) => (
              <ProductCard
                key={item.promotionId}
                thumbnailImageUrl={item.thumbnailImageUrl}
                weekday={contentTypeLabelMap[item.contentType] || item.contentType}
                title={item.promotionTitle}
                date={formatPromotionDate(item.createdAt)}
                onClick={() =>
                  navigate(`/product/${item.promotionId}/edit`, {
                    state: {
                      contentType: item.contentType,
                      title: item.promotionTitle,
                      createdAt: formatPromotionDate(item.createdAt),
                    },
                  })
                }
              />
            ))}
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Product;
