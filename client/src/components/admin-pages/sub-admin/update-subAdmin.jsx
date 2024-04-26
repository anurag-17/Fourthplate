import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const UpdateSubAdmin = ({ editData, closeDrawer, refreshData }) => {
  const token = JSON.parse(localStorage.getItem("admin_token"));
  const [isLoader, setLoader] = useState(false);
  const [subAdminDetail, setSubAdminDetail] = useState(editData);

  const inputHandler = (e) => {
    setSubAdminDetail({
      ...subAdminDetail,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const response = await axios.put(
        `http://34.242.24.155:5000/api/adminauth/update_SubAdminBy_Admin/${subAdminDetail._id}`,
        subAdminDetail,
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
    setSubAdminDetail({
      ...subAdminDetail,
      gender: e.target.value,
    });
  };

  return (
    <>
      <section>
        <div className="flex justify-center items-center border border-[#f3f3f3] rounded-lg bg-white 2xl:px-5 2xl:h-[50px] 2xl:my-5 xl:px-4 xl:h-[40px] xl:my-4 lg:px-3 lg:h-[35px] lg:my-2 md:px-2 md:h-[30px] md:my-2 sm:px-1 sm:h-[25px] sm:my-2 px-1 h-[25px] my-2">
          <h2 className="custom_heading_text font-semibold">Update SubAdmin</h2>
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
                value={subAdminDetail.name}
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
                value={subAdminDetail.contact}
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
                value={subAdminDetail.age}
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
                value={subAdminDetail.gender} // Bind the selected value to state
                onChange={handleGenderChange} // Handle selection change
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex justify-center w-full">
              {" "}
              <div className="flex justify-center mx-auto">
                <button
                  type="submit"
                  disabled={isLoader}
                  className="custom_btn mx-auto"
                >
                  {isLoader ? "Loading..." : "Update SubAdmin"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default UpdateSubAdmin;
