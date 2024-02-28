import { useState } from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import axios from "axios";

import "react-toastify/dist/ReactToastify.css";
import './App.css';

import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import AdminDashboard from "./components/AdminDashboard";
import ResetPassword from "./components/auth/ResetPassword";
import ChangePassword from "./components/auth/ChangePassword";


function App() {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("ad_token"))  || null)

// console.log(token)

  function PrivateRoute({ path, element }) {
  
    return token ? (
      element
    ) : (
      element
      // <Navigate to="/login" />
    );
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
          <Route path="/reset-password/:token" element={<ResetPassword />} />
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
      <ToastContainer

      />
    
    </div>
  );
}

export default App;
