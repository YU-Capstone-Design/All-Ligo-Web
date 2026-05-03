import { BrowserRouter, Route, Routes } from "react-router-dom";
import GlobalLayout from "./layout/GlobalLayout";
import Splash from "./pages/Splash";
import OwnerLogin from "./pages/OwnerLogin";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GlobalLayout />}>
          <Route path="/" element={<Splash />} />
          <Route path="/owner-login" element={<OwnerLogin />} />
          <Route path="/login" element={<OwnerLogin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
