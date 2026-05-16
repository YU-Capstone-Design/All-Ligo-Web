import { useNavigate, useLocation } from "react-router-dom";

import { MdHomeFilled } from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";
import { IoIosListBox } from "react-icons/io";
import { FaUser } from "react-icons/fa6";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "home", label: "홈", path: "/home", Icon: MdHomeFilled },
    {
      id: "product",
      label: "제품 관리",
      path: "/product",
      Icon: AiFillProduct,
    },
    { id: "queue", label: "대기열", path: "/queue", Icon: IoIosListBox },
    { id: "mypage", label: "마이페이지", path: "/mypage", Icon: FaUser },
  ];

  const activeIndex = navItems.findIndex((item) =>
    location.pathname.startsWith(item.path)
  );
  const safeActiveIndex = activeIndex === -1 ? 3 : activeIndex;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-[24px] pb-[calc(32px+env(safe-area-inset-bottom))] pt-[10px] bg-transparent pointer-events-none">
      <nav className="relative mx-auto flex h-[72px] max-w-[400px] items-center justify-between rounded-[36px] bg-white px-[6px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] pointer-events-auto border border-gray-100/50">
        <div
          className="absolute top-[5px] bottom-[5px] left-[2px] right-[2px] pointer-events-none z-0 transition-transform duration-300 ease-out"
          style={{
            width: "calc((100% - 12px) / 4)",
            transform: `translateX(calc(${safeActiveIndex} * 100%))`,
          }}
        >
          <div className="mx-auto h-full w-[100px] rounded-[30px] bg-[#E8F1FF]" />
        </div>

        {navItems.map((item, index) => {
          const isActive = safeActiveIndex === index;
          const CurrentIcon = item.Icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.path)}
              className={`relative z-10 flex flex-1 h-[62px] flex-col items-center justify-center transition-colors duration-200 ${
                isActive ? "text-[#2880EB]" : "text-[#A3AAB3]"
              }`}
            >
              <CurrentIcon className="text-[28px] shrink-0" />
              <span className="mt-[4px] text-[11px] font-bold tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNavigation;
