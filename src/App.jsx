import { BrowserRouter, Route, Routes } from "react-router-dom";
import GlobalLayout from "./layout/GlobalLayout";
import Splash from "./pages/Splash";
import OwnerLogin from "./pages/OwnerLogin";
import EmailRegistration from "./pages/EmailRegistration";
import OwnerStoreName from "./pages/OwnerStoreName";
import OwnerStoreLink from "./pages/OwnerStoreLink";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GlobalLayout />}>
          <Route path="/" element={<Splash />} />
          <Route path="/owner-login" element={<OwnerLogin />} />
          <Route path="/email-registration" element={<EmailRegistration />} />
          <Route path="/owner-store-name" element={<OwnerStoreName />} />
          <Route path="/owner-store-link" element={<OwnerStoreLink />} />
          <Route path="/login" element={<OwnerLogin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
