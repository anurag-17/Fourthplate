import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const DeleteModule = ({ id, closeModal, refreshData }) => {
  const [isLoading, setLoading] = useState(false);
  const token = JSON.parse(localStorage.getItem("token"));

  const handleClose = () => {
    closeModal();
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.delete(
        `http://34.242.24.155:5000/api/eventauth/deleteEvent/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Category Deleted successfully!");
        closeModal();
        refreshData();
      } else {
        toast.error("Failed. Something went wrong!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed. Something went wrong!");
    } finally {
      setLoading(false);
    }
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
            className="w-full border border-1 rounded-md border-lightBlue-400 text-lightBlue-700 hover:bg-lightBlue-200 text-sm  px-2 py-3
                              hover:border-none  border-sky-400 text-sky-700 hover:bg-sky-200 custom_btn_d "
            onClick={handleClose}
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

export default DeleteModule;
