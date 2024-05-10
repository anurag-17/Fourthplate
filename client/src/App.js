import { useState } from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import AdminDashboard from "./components/AdminDashboard";
import ResetPassword from "./components/auth/ResetPassword";
import ChangePassword from "./components/auth/ChangePassword";
import User from "./components/admin-pages/user/User";
import Setting from "./components/auth/setting";
import SubAdminLogin from "./components/subAdmin-pages/auth/subAdmin-login";
import SubAdminDashboard from "./components/subAdminDashboard";
import Template from "./components/template/template";

function App() {
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("ad_token")) || null
  );
  const [SubAdmin_token, setSubAdmin_token] = useState(
    JSON.parse(localStorage.getItem("ad_token")) || null
  );
  // console.log(token)

  function PrivateRoute({ path, element }) {
    return token ? element : element;
    // <Navigate to="/login" />
  }
  function SubAdminPrivateRoute({ path, element }) {
    return SubAdmin_token ? element : element;
    // <Navigate to="/login" />
  }

  // const verify = async () => {
  //   try {
  //     const res = await axios.get(`/api/auth/verifyUserToken/${token}`);
  //       // console.log(res);
  //     if (res?.data?.success) {
  //       // alert("ok")
  //       return;
  //     } else {
  //        <Navigate to="/login" />
  //     }
  //   } catch (error) {
  //     console.error("Error occurred:", error);
  //     toast.error("Invalid authrization!");
  //      <Navigate to="/login" />
  //   }
  // };

  // useEffect(() => {
  //   if (token) {
  //       verify()
  //   }
  //   else {
  //     <Navigate to="/login" />
  //   }
  // }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/user-list" element={<User />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/seting" element={<Setting />} />
          <Route path="/delete-account" element={<Template />} />

          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/subadmin-login" element={<SubAdminLogin />} />
          <Route
            path="/subadmin-dashboard"
            element={<SubAdminPrivateRoute element={<SubAdminDashboard />} />}
          />
          <Route
            path="/admin-dashboard"
            element={<PrivateRoute element={<AdminDashboard />} />}
          />
          {/* <Route
            path="/"
            element={<PrivateRoute element={<AdminDashboard />} />}
          />
           */}
          <Route path="/change-password" element={<ChangePassword />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
