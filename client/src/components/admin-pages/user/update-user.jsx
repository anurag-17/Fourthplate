import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const UpdateUser = ({ editData, closeDrawer, refreshData }) => {
  const token = JSON.parse(localStorage.getItem("admin_token"));
  const [isLoader, setLoader] = useState(false);
  const [userDetail, setUserDetail] = useState(editData);

  const inputHandler = (e) => {
    setUserDetail({
      ...userDetail,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const response = await axios.put(
        `/api/adminauth/update/${userDetail._id}`,
        userDetail,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("User Updated Successfully!");
        closeDrawer();
        refreshData();
      } else {
        toast.error("Server error!");
      }
    } catch (error) {
      toast.error(error, "Error");
    }
    setLoader(false);
  };
  const handleGenderChange = (e) => {
    setUserDetail({
      ...userDetail,
      gender: e.target.value,
    });
  };

  return (
    <>
      <section>
        <div className="flex justify-center items-center border border-[#f3f3f3] rounded-lg bg-white 2xl:px-5 2xl:h-[50px] 2xl:my-5 xl:px-4 xl:h-[40px] xl:my-4 lg:px-3 lg:h-[35px] lg:my-2 md:px-2 md:h-[30px] md:my-2 sm:px-1 sm:h-[25px] sm:my-2 px-1 h-[25px] my-2">
          <h2 className="custom_heading_text font-semibold">Update User</h2>
        </div>
        <div>
          <form
            onSubmit={handleUpdateUser}
            className="bg-white border flex flex-wrap rounded-lg 2xl:p-2 xl:p-2 lg:p-1 md:p-2 p-1 mx-auto"
          >
            <div className="mt-2 w-1/2">
              <label className="custom_input_label">Full Name</label>
              <input
                onChange={inputHandler}
                value={userDetail.name}
                type="text"
                name="name"
                className="custom_inputt capitalize"
                required
                maxLength={84}
              />
            </div>
            <div className="mt-2 w-1/2">
              <label className="custom_input_label">Contact No.</label>
              <input
                onChange={inputHandler}
                value={userDetail.contact}
                // type="number"
                name="contact"
                className="custom_inputt capitalize"
                required
                maxLength={10}
              />
            </div>
            <div className="mt-2 w-1/2">
              <label className="custom_input_label">Age</label>
              <input
                onChange={inputHandler}
                value={userDetail.age}
                // type="number"
                name="age"
                className="custom_inputt capitalize"
                required
                maxLength={2}
              />
            </div>
            <div className="w-1/2 flex items-center">
              <select
                id="gender"
                className="custom_inputt capitalize"
                value={userDetail.gender} // Bind the selected value to state
                onChange={handleGenderChange} // Handle selection change
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex justify-center">
              {" "}
              <div className="flex justify-center w-full">
                <button
                  type="submit"
                  disabled={isLoader}
                  className="custom_btn mx-auto"
                >
                  {isLoader ? "Loading..." : "Update"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default UpdateUser;
