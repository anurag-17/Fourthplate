import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import RightSection from "./RightSection";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // const state = useSelector((state) => state);

  const InputHandler = (e) => {
    setLoginDetails({ ...loginDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/adminauth/login",
        loginDetails,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);
      if (res?.data?.success === true) {
        toast.success("Login successfully!");
        navigate("/admin-dashboard");
        localStorage.setItem("token", JSON.stringify(res?.data?.token));
        setLoading();
      } else {
        toast.error("Login failed please try later!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      // toast.error(error?.response?.data?.error || "Server error !");
    }
  };

  return (
    <>
      <ToastContainer autoClose={1000} />
      <div className="flexCenter lg:min-h-screen  ">
        <div className="md:px-[50px] w-full mx-auto">
          <div className="relative flexCenter flex-col 2xl:gap-x-20 xl:gap-x-10 gap-x-7 min-h-screen lg:shadow-none lg:flex-row space-y-8 md:space-y-0 w-[100%] px-[10px]bg-white lg:px-[40px] py-[20px] md:py-[40px] ">
            <div className="w-[100%] lg:w-[60%] xl:w-[50%]">
              <form action="" className="" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 justify-center p-8 lg:p-14 md:max-w-[80%] lg:w-full lg:max-w-[100%] mx-auto ">
                  <div className="text-left ">
                    <p className="mb-2 bold-40 ">Welcome Admin</p>
                    <p className="regular-16 leading-[26px] text-gray-400 mb-4">
                      Welcome back! Please enter your details
                    </p>
                  </div>
                  <div className="md:py-2">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      className="login-input"
                      onChange={InputHandler}
                      title="enter valid email ex. abc@gmail.com"
                      required
                    />
                  </div>
                  <div className="">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      className="login-input "
                      onChange={InputHandler}
                      minLength={8}
                      required
                      autoComplete="current-password"
                    />
                    <div className="flex items-center mt-4 px-2 cursor-pointer">
                      <input
                        type="checkbox"
                        id="showPassword"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                        className="mr-2"
                      />
                      <label
                        htmlFor="showPassword"
                        className="login-input-label"
                      >
                        Show Password
                      </label>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="login_button"
                    >
                      {isLoading ? "Loading.." : "Sign In"}
                    </button>
                    <Link to="/forgot-password">
                      <div className="regular-16 underline text-center py-3 cursor-password">
                        Forgot password
                      </div>
                    </Link>
                  </div>
                </div>
              </form>
            </div>
            <RightSection />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
