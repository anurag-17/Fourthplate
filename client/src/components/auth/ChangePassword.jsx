// import axios from "axios";
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// import OpenEye from "../admin-pages/Svg/OpenEye";
// import CloseEye from "../admin-pages/Svg/CloseEye";
// // import rightImage from "../../assets/ch-pwd.webp";
// import Backarrow from "../admin-pages/Svg/Backarrow";
// import RightSection from "./RightSection";

// const ChangePassword = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     oldPassword: "",
//     newPassword: "",
//   });
//   const [cnfmPassword, setCnfmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showCnfmPassword, setShowCnfmPassword] = useState(false);
//   const [isLoading, setLoading] = useState(false);
//   const [isError, setError] = useState("");
//   const [token, setToken] = useState(JSON.parse(localStorage.getItem("ad_token"))  || null)

//   const InputHandler = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.oldPassword === formData.newPassword) {
//       toast.error("Old password and new password can't be same ");
//     } else if (formData.newPassword !== cnfmPassword) {
//       toast.error("New password and confirm password should match");
//     } else {
//       try {
//         setLoading(true);

//         const res = await axios.post(
//           "/api/adminauth/updatePass",
//           formData,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: token,
//             },
//           }
//         );

//         if (res.data?.success) {
//           toast.success("Password change successfully!");
//           setLoading(false);
//           setError("");
//           navigate("/login");
//         } else {
//           toast.error("Server error!");
//           setLoading(false);
//           setError("");
//         }
//       } catch (error) {
//         console.error("Error during login:", error);
//         toast.error(error?.response?.data?.error || "Server error!");
//         setError("");
//         setLoading(false);
//       }
//     }
//   };

//   return (
//     <>
//       <>
//         <div className="flex items-center justify-center lg:min-h-screen  ">
//           <div className="md:px-[50px] w-full mx-auto">
//             <div className="relative flexCenter flex-col 2xl:gap-x-20 xl:gap-x-10 gap-x-7 min-h-screen lg:shadow-none lg:flex-row space-y-8 md:space-y-0 w-[100%] px-[10px]bg-white lg:px-[40px] py-[20px] md:py-[40px]  ">
//             <div
//                 className="absolute right-10 top-6 bg-[#e5f0fa] hover:bg-[#c5dcf0] px-3 py-1 rounded cursor-pointer flex items-center gap-3"
//                 onClick={() => navigate(-1)}
//               >
//                 <Backarrow/>
//                 Go back
//               </div>
//               <div className="w-[100%] lg:w-[60%] xl:w-[50%]">
//                 <form action="" className="" onSubmit={handleSubmit}>
//                   <div className="flex flex-col gap-4 justify-center p-8 lg:p-14 md:max-w-[80%] lg:w-full lg:max-w-[100%] mx-auto ">
//                     <div className="text-left ">
//                       <p className="mb-2 2xl:text-[35px] md:text-[30px] text-[24px] leading-[38px] md:font-bold font-medium whitespace-nowrap">
//                         Change password
//                       </p>
//                       {/* <p className="text-[15px] font-[400] leading-[26px] text-gray-400 mb-4 text-[#494949]">
//                        Welcome back! Please enter your details
//                         </p> */}
//                     </div>

//                     <div className="relative flex justify-center items-center mt-4">
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         name="oldPassword"
//                         placeholder="Old password"
//                         className="login-input placeholder:text-[gray] w-full custom-input "
//                         onChange={InputHandler}
//                         minLength={8}
//                         required
//                       />
//                       <div
//                         className="absolute right-[10px] cursor-pointer"
//                         onClick={() => setShowPassword(!showPassword)}
//                       >
//                         {showPassword ? <OpenEye /> : <CloseEye />}
//                       </div>
//                     </div>
//                     <div className="relative flex justify-center items-center">
//                       <input
//                         type={showNewPassword ? "text" : "password"}
//                         name="newPassword"
//                         placeholder="New password"
//                         className="login-input placeholder:text-[gray] w-full mt-2 custom-input"
//                         onChange={InputHandler}
//                         minLength={8}
//                         required
//                       />
//                       <div
//                         className="absolute right-[10px] cursor-pointer"
//                         onClick={() => setShowNewPassword(!showNewPassword)}
//                       >
//                         {showNewPassword ? <OpenEye /> : <CloseEye />}
//                       </div>
//                     </div>
//                     <div className="relative flex justify-center items-center">
//                       <input
//                         type={showCnfmPassword ? "text" : "password"}
//                         name="cnfmPassword"
//                         placeholder="Confirm new password "
//                         className="login-input placeholder:text-[gray] w-full mt-2 custom-input"
//                         onChange={(e) => setCnfmPassword(e.target.value)}
//                         minLength={8}
//                         required
//                       />
//                       <div
//                         className="absolute dash-menu right-[10px] cursor-pointer"
//                         onClick={() => setShowCnfmPassword(!showCnfmPassword)}
//                       >
//                         {showCnfmPassword ? <OpenEye /> : <CloseEye />}
//                       </div>
//                     </div>

//                     {isError && (
//                       <p className="text-[red] mt-2 px-2 text-[14px] lg:text-[13px] font-normal bg-[#f0e3e3] py-1    rounded-[4px]">
//                         {isError}
//                       </p>
//                     )}

//                     <div className="mt-4">
//                       <button
//                         type="submit"
//                         disabled={isLoading}
//                         className="w-full login_button"
//                       >
//                         {isLoading ? "Loading.." : "Change password"}
//                       </button>
//                     </div>

//                   </div>
//                 </form>
//               </div>

//             <RightSection />
//             </div>
//           </div>
//         </div>
//       </>
//     </>
//   );
// };

// export default ChangePassword;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const ChangePassword = () => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [cnfmPassword, setCnfmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isError, setError] = useState("");
  const [isLoader, setLoader] = useState(false);

  const togglePasswordVisibility = (passwordType) => {
    if (passwordType === "password") {
      setShowPassword(!showPassword);
    } else if (passwordType === "newPassword") {
      setShowNewPassword(!showNewPassword);
    } else if (passwordType === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const InputHandler = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword } = formData;

    if (oldPassword === newPassword) {
      setError("Old password and new password can't be the same");
    } else if (newPassword !== cnfmPassword) {
      setError("New password and confirm password should match");
    } else {
      try {
        setLoader(true);
        const res = await axios.post(
          "http://localhost:5000/api/adminauth/updatePass",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status === 200) {
          setFormData({
            oldPassword: "",
            newPassword: "",
          });
          setCnfmPassword("");
          setError("");
          toast.success("Password changed successfully!");
          // signoutFunc();
        } else if (res.status === 203) {
          setError(res?.data?.message);
          setLoader(false);
          return;
        }
      } catch (error) {
        setError("Password change failed!");
        toast.error("Server error");
      } finally {
        setLoader(false);
      }
    }
  };

  // const signoutFunc = () => {
  //   handleSignout();
  // };
  return (
    <>
      <ToastContainer autoClose={1000} />
      <div className="flex items-center justify-center">
        <div className="md:px-[50px] w-full mx-auto">
          <div className="relative flex flex-col 2xl:gap-x-20 xl:gap-x-10 gap-x-7 justify-center lg:shadow-none  items-center lg:flex-row space-y-8 md:space-y-0 w-[100%] px-[10px]bg-white lg:px-[40px] py-[20px] md:py-[40px] ">
            <div className="w-[100%] lg:w-[60%] xl:w-[80%]">
              <form action="" className="" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 justify-center md:max-w-[80%] lg:w-full lg:max-w-[100%] mx-auto px-4">
                  <div className="text-left ">
                    <p className="mb-2 custom_heading_text leading-[38px] md:font-bold font-medium whitespace-nowrap">
                      Change password
                    </p>
                  </div>
                  <div className="relative flex justify-center items-center ">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="oldPassword"
                      placeholder="Old password"
                      className="p-2 2xl:p-3 rounded-[10px] border placeholder:text-[gray] w-full custom-input "
                      onChange={InputHandler}
                      minLength={8}
                      required
                    />
                    <div
                      className="absolute right-[10px] cursor-pointer"
                      onClick={() => togglePasswordVisibility("password")}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </div>
                  </div>
                  <div className="relative flex justify-center items-center">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      placeholder="New password"
                      className="p-2 2xl:p-3 rounded-[10px] border placeholder:text-[gray] w-full mt-2 custom-input"
                      onChange={InputHandler}
                      minLength={8}
                      required
                    />
                    <div
                      className="absolute right-[10px] cursor-pointer"
                      onClick={() => togglePasswordVisibility("newPassword")}
                    >
                      {showNewPassword ? "Hide" : "Show"}
                    </div>
                  </div>
                  <div className="relative flex justify-center items-center">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password "
                      className="p-2 2xl:p-3 rounded-[10px] border placeholder:text-[gray] w-full mt-2 custom-input"
                      onChange={(e) => setCnfmPassword(e.target.value)}
                      minLength={8}
                      required
                    />
                    <div
                      className="absolute right-[10px] cursor-pointer"
                      onClick={() =>
                        togglePasswordVisibility("confirmPassword")
                      }
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </div>
                  </div>
                  {isError && (
                    <p className="text-[red] mt-2 px-2 text-[14px] lg:text-[13px] font-normal bg-[#f0e3e3] py-1 rounded-[4px]">
                      {isError}
                    </p>
                  )}
                  <div className="mt-4">
                    <button
                      type="submit"
                      disabled={isLoader}
                      className="w-full bg-[#1f2432] font-medium text-[15px] text-white rounded-lg hover:border hover:border-black lg:h-[50px] h-[40px] hover:bg-[#fff] hover:text-black"
                    >
                      {isLoader ? "Loading.." : "Change password"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
