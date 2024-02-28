import { useEffect } from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { toast } from "react-toastify";
import axios from "axios";

import "react-toastify/dist/ReactToastify.css";
import './App.css';

import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
// import AdminDashboard from "./components/AdminDashboard";
// import ChangePassword from "./components/auth/ChangePassword";
// import ResetPassword from "./components/auth/ResetPassword";
// import { setUserDetails } from "./redux/action/authAction";


function App() {
  // const navigate = useNavigate();
  const token =   ""
  const user = ""
// console.log(user)

  function PrivateRoute({ path, element }) {
  
    return token ? (
      element
    ) : (
      // element
      <Navigate to="/login" />
    );
  }
 
  const verify = async () => {
    try {
      const res = await axios.get(`/api/auth/verifyUserToken/${token}`);
        // console.log(res);
      if (res?.data?.success) {
        // alert("ok")
        return; 
      } else {
         <Navigate to="/login" />
      }
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error("Invalid authrization!");
       <Navigate to="/login" />
    }
  };

  useEffect(() => {
    if (token) {
        verify()
    }
    else {
      <Navigate to="/login" />
    }
  }, []);

  return (

    <div>
      
      <BrowserRouter>
        <Routes>

          <Route exact path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* 
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route
            path="/admin-dashboard"
            element={<PrivateRoute element={<AdminDashboard />} />}
          />
          <Route
            path="/"
            element={<PrivateRoute element={<AdminDashboard />} />}
          /> */}

        </Routes>
      </BrowserRouter>
      <ToastContainer

      />
    
    </div>
  );
}

export default App;
