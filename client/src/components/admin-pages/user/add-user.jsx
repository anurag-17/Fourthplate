"use client";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const AddUser = ({ closeDrawer, refreshData }) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const [userDetail, setUserDetail] = useState({
    email: "",

    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://34.242.24.155:5000/api/adminauth/Create_UserBy_Admin",
        userDetail,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 ) {
        toast.success("User Added Successfully!");
        refreshData();
        closeDrawer();
      } else {
        toast.error(response.data.message);
       
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding the User.");
    } finally {
    }
  };
  const inputHandler = (e) => {
    setUserDetail({
      ...userDetail,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <>
      <ToastContainer autoClose={1000} />

      <div className=" mx-auto">
        <div className="flex justify-center items-center border border-[#f3f3f3] rounded-lg bg-white 2xl:px-5  2xl:h-[50px] 2xl:my-5 xl:px-4  xl:h-[40px] xl:my-4 lg:px-3  lg:h-[35px] lg:my-2 md:px-2  md:h-[30px] md:my-2 sm:px-1 sm:h-[25px] sm:my-2 px-1 h-[25px] my-2">
          <h2 className="custom_heading_text font-semibold">Add New User</h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap bg-white border rounded-lg 2xl:p-2 xl:p-2 lg:p-1 md:p-2 p-1 mx-auto"
        >
          <div className="w-1/2">
            <label className="custom_input_label">User Email</label>
            <input
              onChange={inputHandler}
              value={userDetail.email}
              type="email"
              name="email"
              className="custom_inputt"
              required
            />
          </div>

          <div className="w-1/2">
            <label className="custom_input_label">User Password</label>
            <input
              onChange={inputHandler}
              value={userDetail.password}
              type="password"
              name="password"
              className="custom_inputt"
              required
            />
          </div>

          <div className="w-full flex justify-center">
            <button type="submit" className="custom_btn">
              Add User
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddUser;
