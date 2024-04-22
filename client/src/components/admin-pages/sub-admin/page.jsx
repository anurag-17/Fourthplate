import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../loader/Index";
import AddSubAdmin from "./add-subAdmin";
import DeleteSubAdmin from "./delete-subAdmin";
import UpdateSubAdmin from "./update-subAdmin";

const SubAdmin = () => {
  const token = JSON.parse(localStorage.getItem("admin_token"));
  const [allData, setAllData] = useState("");
  const [isRefresh, setRefresh] = useState(false);
  const [isLoader, setLoader] = useState(false);
  const [editData, setEditData] = useState([]);
  const [isDrawerOpenO, setIsDrawerOpenO] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerOpenn, setIsDrawerOpenn] = useState(false);
  const [isOpenDelete, setOpenDelete] = useState(false);
  const [id, setId] = useState("");
  const [subAdminEdit, setSubAdminEdit] = useState("");

  const refreshData = () => {
    setRefresh(!isRefresh);
  };

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  function openModals(id) {
    setId(id);
  }
  function openModal(id) {
    setId(id);
    setOpenDelete(true);
  }
  function closeModal() {
    setOpenDelete(false);
  }

  useEffect(() => {
    defaultUser();
  }, [isRefresh]);

  // ==========Get All SubAdmin==============
  const defaultUser = () => {
    const option = {
      method: "GET",
      url: "http://34.242.24.155:5000/api/adminauth/getAll_SubAdmin",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    axios
      .request(option)
      .then((response) => {
        setAllData(response?.data?.data);
        console.log(response?.data?.data, "mera");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // ==========Get A SubAdmin==============

  const openDrawerO = async (_id) => {
    setLoader(true);
    setSubAdminEdit(_id);
    try {
      const options = {
        method: "GET",
        url: `http://34.242.24.155:5000/api/adminauth/get_SubAdminBy_Id/${_id}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      const response = await axios.request(options);
      if (response.status === 200) {
        setEditData(response?.data?.data);
        console.log(response?.data?.data, "subadmin");
        setIsDrawerOpenO(true);
        setLoader(false);
      } else {
        console.error("Error: Unexpected response status");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const closeDrawerO = () => {
    setIsDrawerOpenO(false);
  };
  // ==========Get A SubAdmin Details==============

  const closeDrawerOO = () => {
    setIsDrawerOpenn(false);
  };
  const openDrawerDetails = async (_id) => {
    setLoader(true);
    try {
      const options = {
        method: "GET",
        url: `http://34.242.24.155:5000/api/adminauth/get_SubAdminBy_Id/${_id}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      const response = await axios.request(options);
      if (response.status === 200) {
        setEditData(response?.data?.data);
        setIsDrawerOpenn(true);
        setLoader(false);
      } else {
        console.error("Error: Unexpected response status");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {isLoader && <Loader />}
      <ToastContainer autoClose={1000} />
      <section className="w-full">
        <div className=" mx-auto">
          <div className="mt-2 sm:mt-2 lg:mt-3 xl:mt-4 2xl:mt-7 flex justify-between items-center 2xl:px-10 border mx-5 lg:mx-8 bg-white rounded-lg 2xl:h-[100px] xl:h-[70px] lg:h-[60px] md:h-[50px] sm:h-[45px] h-[45px]  xl:px-8 lg:px-5 md:px-4 sm:px-4 px-4">
            <h2 className="font-semibold custom_heading_text">
              Sub-Admin List
            </h2>
            {/* <button
              onClick={handleDownload}
              className="border p-1 rounded-md px-2 border-green-600 text-green-800 hover:border-green-100 hover:bg-green-100"
            >
              Download
            </button> */}
          </div>

          <div className=" mx-5 lg:mx-8 my-5 flex justify-end">
            <button
              onClick={openDrawer}
              className="border hover:bg-gray-300 rounded-md text-white my-auto bg-lightBlue-600  cursor-pointer 2xl:p-2  2xl:text-[18px] xl:p-2 xl:text-[14px] lg:p-[6px] lg:text-[12px] md:text-[10px] md:p-1 sm:text-[10px] sm:p-1 p-[3px] text-[12px]"
            >
              + Add SubAdmin
            </button>
          </div>

          <div className=" flex mx-5 lg:mx-8  overflow-x-auto ">
            <div className="  w-full ">
              <div className="overflow-y-scroll  ">
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    {/* head */}
                    <thead>
                      <tr>
                        <th>S.NO</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Contact.No</th>
                        <th>Email</th>
                        <th>Preview</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(allData) &&
                        allData.map((item, index) => (
                          <tr>
                            <th>{index + 1}</th>
                            <td>{item.name}</td>
                            <td>{item.age}</td>
                            <td>{item.contact}</td>
                            <td>{item.email}</td>
                            <td>
                              <div className="flex ">
                                <button
                                  onClick={() => openDrawerDetails(item?._id)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="w-6 h-6"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                    />
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </td>
                            <td>
                              {" "}
                              <div className=" my-3 gap-5">
                                <button onClick={() => openDrawerO(item?._id)}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8 text-sky-600"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                    />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openModal(item?._id)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8 text-red-800"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================Add Modale========== */}

      <Transition appear show={isDrawerOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-1 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-2/3 sm:w-[600px] 2xl:w-[800px] transform overflow-hidden rounded-2xl bg-white sm:py-6 p-4  sm:px-8 lg:px-8 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-end">
                    <button onClick={closeDrawer}>X</button>
                  </div>
                  <AddSubAdmin
                    closeDrawer={closeDrawer}
                    refreshData={refreshData}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* ==================Update Modale========== */}
      <Transition appear show={isDrawerOpenO} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-2/3 sm:w-full sm:max-w-[700px]  transform overflow-hidden rounded-2xl bg-white p-4  sm:px-8 lg:px-8 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-end">
                    <button onClick={closeDrawerO}>X</button>
                  </div>
                  <UpdateSubAdmin
                    cateEdit={subAdminEdit}
                    closeDrawer={closeDrawerO}
                    refreshData={refreshData}
                    editData={editData}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* ==================Delete Modale========== */}

      <Transition appear show={isOpenDelete} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-[90%] sm:w-full sm:max-w-[500px] transform overflow-hidden rounded-2xl bg-white p-4  sm:px-8 lg:px-8 2xl:p-10 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="custom_heading_text font-semibold leading-6 text-gray-900 mt lg:mt-5"
                  >
                    Are You Sure! Want to Delete?
                  </Dialog.Title>
                  <DeleteSubAdmin
                    closeModal={closeModal}
                    refreshData={refreshData}
                    id={id}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* ==================SubAdmin Detail Modale========== */}
      <Transition appear show={isDrawerOpenn} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-1 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-2/3 sm:w-[600px] 2xl:w-[800px] transform overflow-hidden rounded-2xl bg-white sm:py-6 p-4  sm:px-8 lg:px-8 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-end">
                    <button onClick={closeDrawerOO}>X</button>
                  </div>
                  <div>
                    <h1 className="font-semibold text-[20px] 2xl:text-[25px]">
                      SubAdmin Details
                    </h1>
                    <div className="my-3">
                      <h1 className="my-2">Name : {editData.name}</h1>
                      <h1 className="my-2">Email : {editData.email}</h1>

                      <h1 className="my-2">Contact No. : {editData.contact}</h1>

                      <h1 className="my-2">Age : {editData.age}</h1>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default SubAdmin;
