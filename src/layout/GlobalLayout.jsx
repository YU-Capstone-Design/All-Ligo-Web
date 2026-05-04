import React from "react";
import { Outlet } from "react-router-dom";

const GlobalLayout = () => {
  return (
    <div className="min-h-screen bg-[#9c9c9c]">
      <div className="mx-auto min-h-screen w-full max-w-[430px] bg-white">
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default GlobalLayout;
