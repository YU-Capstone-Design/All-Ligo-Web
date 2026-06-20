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

import MakePage from "./pages/MakePage";
import MakeComplete from "./pages/MakeComplete";
import Home from "./pages/Home";
import Product from "./pages/Product";
import ProductEdit from "./pages/ProductEdit";
import ClearPage from "./pages/ClearPage";
import Queue from "./pages/Queue";
import Notifications from "./pages/Notifications";
import Guest from "./pages/Guest";
import GuestCouponList from "./pages/GuestCouponList";
import AuthSuccess from "./pages/AuthSuccess";
import AuthFail from "./pages/AuthFail";
import RequireOwnerAuth from "./components/auth/RequireOwnerAuth";
import NotFound from "./pages/NotFound";

import MyPage from "./pages/mypage/Mypage";
import CouponRegistration from "./pages/mypage/CouponRegistration";
import CouponModify from "./pages/mypage/CouponModify";
import ProfileEdit from "./pages/mypage/ProfileEdit";
import MyLocationSetting from "./pages/mypage/MyLocationSettiing";
import FirstScreen from "./pages/FirstScreen";

const requireOwnerAuth = (page) => (
  <RequireOwnerAuth>
    {page}
  </RequireOwnerAuth>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GlobalLayout />}>
          <Route path="/thumbnail" element={<Thumbnail />} />
          <Route path="/splash" element={<Splash />} />
          <Route path="/owner-login" element={<OwnerLogin />} />
          <Route path="/email-registration" element={<EmailRegistration />} />
          <Route path="/owner-store-name" element={<OwnerStoreName />} />
          <Route path="/owner-store-link" element={<OwnerStoreLink />} />
          <Route
            path="/owner-store-location"
            element={<OwnerStoreLocation />}
          />
          <Route path="/owner-password" element={<OwnerPassword />} />
          <Route path="/success-page" element={<SuccessPage />} />

          <Route path="/makepage" element={requireOwnerAuth(<MakePage />)} />
          <Route path="/home" element={requireOwnerAuth(<Home />)} />
          <Route path="/product" element={requireOwnerAuth(<Product />)} />
          <Route path="/queue" element={requireOwnerAuth(<Queue />)} />
          <Route
            path="/notifications"
            element={requireOwnerAuth(<Notifications />)}
          />
          <Route path="/guest" element={<Guest />} />
          <Route path="/guest/coupons" element={<GuestCouponList />} />
          <Route path="/auth-success" element={<AuthSuccess />} />
          <Route path="/auth-fail" element={<AuthFail />} />
          <Route
            path="/product/:productId/edit"
            element={requireOwnerAuth(<ProductEdit />)}
          />
          <Route
            path="/clear/:productId"
            element={requireOwnerAuth(<ClearPage />)}
          />
          <Route
            path="/makecomplete"
            element={requireOwnerAuth(<MakeComplete />)}
          />

          <Route path="/mypage" element={requireOwnerAuth(<MyPage />)} />
          <Route
            path="/mypage/coupons/new"
            element={requireOwnerAuth(<CouponRegistration />)}
          />
          <Route
            path="/mypage/coupons/modify"
            element={requireOwnerAuth(<CouponModify />)}
          />
          <Route
            path="/mypage/profile"
            element={requireOwnerAuth(<ProfileEdit />)}
          />
          <Route
            path="/mypage/location"
            element={requireOwnerAuth(<MyLocationSetting />)}
          />
          <Route path="/" element={<FirstScreen/>}/>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
