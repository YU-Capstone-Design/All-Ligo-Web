import { BrowserRouter, Route, Routes } from "react-router-dom";
import GlobalLayout from "./layout/GlobalLayout";
import Splash from "./pages/Splash";
import OwnerLogin from "./pages/OwnerLogin";
import EmailRegistration from "./pages/OwnerMembership/EmailRegistration";
import OwnerStoreName from "./pages/OwnerMembership/OwnerStoreName";
import OwnerStoreLink from "./pages/OwnerMembership/OwnerStoreLink";
import OwnerStoreLocation from "./pages/OwnerMembership/OwnerStoreLocation";
import Thumbnail from "./pages/Thumbnail";
import OwnerPassword from "./pages/OwnerMembership/OwnerPassword";
import SuccessPage from "./pages/OwnerMembership/SuccessPage";
import MyPage from "./pages/mypage/Mypage";
import CouponRegistration from "./pages/mypage/CouponRegistration";
import ProfileEdit from "./pages/mypage/ProfileEdit";
import MyLocationSetting from "./pages/mypage/MyLocationSettiing";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GlobalLayout />}>
          <Route path="/" element={<Thumbnail />} />
          <Route path="/splash" element={<Splash />} />
          <Route path="/owner-login" element={<OwnerLogin />} />
          <Route path="/email-registration" element={<EmailRegistration />} />
          <Route path="/owner-store-name" element={<OwnerStoreName />} />
          <Route path="/owner-store-link" element={<OwnerStoreLink />} />
          <Route
            path="/owner-store-location"
            element={<OwnerStoreLocation />}
          />
          <Route path="/login" element={<OwnerLogin />} />
          <Route path="/owner-password" element={<OwnerPassword />} />
          <Route path="/success-page" element={<SuccessPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mypage/coupons/new" element={<CouponRegistration />} />
          <Route path="/mypage/profile" element={<ProfileEdit />} />
          <Route path="/mypage/location" element={<MyLocationSetting />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
