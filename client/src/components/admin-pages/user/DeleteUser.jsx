import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const DeleteUser = ({ id, closeModal, refreshData }) => {
  const [isLoading, setLoading] = useState(false);
  const token = JSON.parse(localStorage.getItem("admin_token"));

  const handleDelete = (e) => {
    e.preventDefault();
    setLoading(true);

    const options = {
      method: "DELETE",
      url: `http://34.242.24.155:5000/api/userauth/deletuser/${id}`,

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    axios
      .request(options)
      .then(function (res) {
        if (res.data?.success) {
          setLoading(false);
          toast.success("User deleted successfully!");
          closeModal();
          refreshData();
        } else {
          setLoading(false);
          toast.error("Failed. something went wrong!");
          return;
        }
      })
      .catch(function (error) {
        setLoading(false);
        console.error(error);
        toast.error("Server error!");
      });
  };

  return (
    <>
      <div className="mt-2">
        <p className="text-[12px] sm:text-[16px] font-normal ms:leading-[30px] text-gray-500 mt-4">
          Do you really want to delete these records? You can't view this in
          your list anymore if you delete!
        </p>
      </div>

      <div className=" mt-4 lg:mt-8">
        <div className="flex justify-between gap-x-5">
          <button
            className="w-full border border-1 rounded-md border-green-400 text-green-700 hover:bg-green-200 text-sm  px-2 py-3
                              hover:border-none  border-green-400 text-green-700 hover:bg-green-200 custom_btn_d "
            onClick={closeModal}
          >
            No, Keep It
          </button>

          <button
            className={`w-full  rounded-md 
            custom_btn_d 
                              border-red-400 text-red-700 bg-red-200  
                              hover:border-none
                        ${isLoading ? "bg-gray-200" : "hover:bg-red-200"}
                        hover:border-none`}
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Yes, Delete It"}
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteUser;
