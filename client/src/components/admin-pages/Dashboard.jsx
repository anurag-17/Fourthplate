import React, { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import dash_img from "../../assets/g2raph.svg";
import PasswordIcon from "./Svg/PasswordIcon";
import ProfileIcon from "./Svg/ProfileIcon";
import SignOutIcon from "./Svg/SignOutIcon";
import UsersIcon from "./Svg/UsersIcon";

const Dashboard = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();
  const [count, setCount] = useState();
  
useEffect(() => {
  countData()
}, []);

  const handleSignout = async () => {
    try {
      const res = await axios.get(
        "http://34.242.24.155:5000/api/adminauth/logout",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);
      if (res?.data?.success) {
        localStorage.removeItem("token");
        toast.success("Logout successfully !");
        navigate("/login"); 
      } else {
        toast.error("Logout failed try again !");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error(error?.response?.data?.message || "Invalid token !");
    }
  };
const countData = async()=>{
  try {
    const res = await axios.get(
      "http://34.242.24.155:5000/api/adminauth/counts",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log(res?.data); 
    setCount(res?.data)
  } catch (error) {
    console.error("Error occurred:", error);
  }
}
  return (
    <>
      <section className>
        <div className=" mx-auto">
          <div className="rounded-[10px] bg-white py-[20px] flexCenter md:flexBetween flex-col md:flex-row gap-3 px-[20px]">
            <p className="text-[20px] md:text-[22px] font-semibold leading-tight md:block hidden mt-[20px] lg:mt-0">
              Welcome to Admin Dashboard
            </p>
            <p className="text-[20px] md:text-[22px] font-semibold leading-tight text-center mt-[30px] md:hidden block">
              Welcome to
              <br /> Admin Dashboard
            </p>
            <div className="flexCenter gap-x-7 lg:gap-x-5 md:flex-auto flex-wrap gap-y-3 md:justify-end">
              <Menu
                as="div"
                className="relative text-left w-[50px] h-[50px] rounded-[50%] border p-1 flexCenter"
              >
                <div>
                  <Menu.Button className="flexCenter w-full ">
                    <ProfileIcon className="ml-2 h-4 w-4 text-gray-700" />
                    {/* <img src={userDetails?.profilePicture} alt="profile" 
                    className="w-full"/> */}
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-700"
                  enterFrom="transform scale-95"
                  enterTo="transform scale-100"
                  leave="transition ease-in duration=75"
                  leaveFrom="transform scale-100"
                  leaveTo="transform scale-95"
                >
                  <Menu.Items className="absolute md:right-4 top-11 w-56 z-[11] mt-2 px-2 py-5 shadow-2xl rounded-lg origin-top-right border border-[#f3f3f3] bg-[white]  side-profile">
                    <div className="p-1 flex flex-col gap-4">
                      <Menu.Item>
                        <Link
                          to="/setting"
                          className="flex gap-x-3 hover:underline text-gray-700 rounded  text-sm group transition-colors items-center"
                        >
                          <PasswordIcon className="h-[20px] w-[20px] mr-2" />
                          Profile
                        </Link>
                      </Menu.Item>
                      <Menu.Item>
                        <div
                          onClick={handleSignout}
                          className="flex gap-x-3 hover:underline text-gray-700 rounded  text-sm group transition-colors items-center"
                        >
                          <SignOutIcon />
                          Sign out
                        </div>
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <div className="px-[20px]">
          <div className="md:py-[30px] py-[20px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <div className="col-span-1 bg-white px-5 py-4 rounded flex items-center gap-5">
              <div className="bg-green-800 h-[50px] w-[50px] flexCenter rounded-[6px]">
                {" "}
                <UsersIcon />{" "}
              </div>
              <div className="">
                <h6 className="capitalize text-[15px]">Total Users</h6>
                <h6 className="capitalize text-[16px] font-semibold pt-1">{count?.userCount}</h6>
              </div>
            </div>
            <div className="col-span-1 bg-white px-5 py-4 rounded flex items-center gap-5">
              <div className="bg-green-800 h-[50px] w-[50px] flexCenter rounded-[6px]">
                {" "}
                <UsersIcon />{" "}
              </div>
              <div className="">
                <h6 className="capitalize text-[15px]">Total Events</h6>
                <h6 className="capitalize text-[16px] font-semibold pt-2">
                  {count?.eventCount}
                </h6>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
