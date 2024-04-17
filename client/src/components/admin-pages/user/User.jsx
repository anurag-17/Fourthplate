import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { Switch } from "@headlessui/react";
import DeleteUser from "./DeleteUser";
import CloseIcon from "../Svg/CloseIcon";
import Pagination from "../../pagination/Pagination";
import Loader from "../../loader/Index";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UpdateUser from "./update-user";
import AddUser from "./add-user";

const User = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const [allData, setAllData] = useState("");
  const [isOpenDelete, setOpenDelete] = useState(false);
  const [id, setId] = useState("");
  const [isRefresh, setRefresh] = useState(false);
  const [data, setData] = useState([]);
  const [isLoader, setLoader] = useState(false);
  const [userEdit, setUserEdit] = useState("");
  const [editData, setEditData] = useState([]);
  const [isDrawerOpenO, setIsDrawerOpenO] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const refreshData = () => {
    setRefresh(!isRefresh);
  };

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

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

  // ==========Get All User==============
  const defaultUser = () => {
    const option = {
      method: "GET",
      url: "http://34.242.24.155:5000/api/adminauth/getalluser",
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

  // ==========Upadte User Block/Unblock==============

  const handleToggleBlocked = async (id, isBlocked) => {
    if (isBlocked === undefined) return;

    const updatedItems = data.map((item) => {
      if (item._id === id) {
        return { ...item, isBlocked: !isBlocked };
      }
      return item;
    });
    setData(updatedItems);

    try {
      const res = await axios.put(
        `http://34.242.24.155:5000/api/userauth/update/${id}`,
        { isBlocked: !isBlocked },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data?.success) {
        defaultUser();
        toast.success("User Updated Successfully ");
        setLoader();
      } else {
        console.error("Toggle blocked request failed.");
        setData(data);
      }
    } catch (error) {
      console.error("Toggle blocked request failed:", error);
      setData(data);
    }
  };

  // ==========Download==============

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        "http://34.242.24.155:5000/api/userauth/userData",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Download Start");
        window.open(
          "http://34.242.24.155:5000/api/userauth/userData",
          "_blank"
        );
      } else {
        toast.error("Download failed.");
      }
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  // ==========Get A User==============

  const openDrawerO = async (_id) => {
    setLoader(true);
    setUserEdit(_id);
    try {
      const options = {
        method: "GET",
        url: `http://34.242.24.155:5000/api/adminauth/getauser/${_id}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      const response = await axios.request(options);
      if (response.status === 200) {
        setEditData(response?.data?.user);
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

  return (
    <>
      {isLoader && <Loader />}
      <ToastContainer autoClose={1000} />
      <section className="w-full">
        <div className=" mx-auto">
          <div className="mt-2 sm:mt-2 lg:mt-3 xl:mt-4 2xl:mt-7 flex justify-between items-center 2xl:px-10 border mx-5 lg:mx-8 bg-white rounded-lg 2xl:h-[100px] xl:h-[70px] lg:h-[60px] md:h-[50px] sm:h-[45px] h-[45px]  xl:px-8 lg:px-5 md:px-4 sm:px-4 px-4">
            <h2 className="font-semibold custom_heading_text">User List </h2>
            <button
              onClick={handleDownload}
              className="border p-1 rounded-md px-2 border-green-600 text-green-800 hover:border-green-100 hover:bg-green-100"
            >
              Download
            </button>
          </div>
          <div className=" mx-5 lg:mx-8 my-5 flex justify-end">
            <button
              onClick={openDrawer}
              className="border hover:bg-gray-300 rounded-md text-white my-auto bg-lightBlue-600  cursor-pointer 2xl:p-2  2xl:text-[18px] xl:p-2 xl:text-[14px] lg:p-[6px] lg:text-[12px] md:text-[10px] md:p-1 sm:text-[10px] sm:p-1 p-[3px] text-[12px]"
            >
              + Add User
            </button>
          </div>
          <div className=" flex mx-5 lg:mx-8  overflow-x-auto ">
            <div className="  w-full ">
              <div className="overflow-y-scroll  ">
                <div className="h-[300px] xl:h-[400px]">
                  <table className="w-[1500px] lg:w-[150%] xl:w-[100%] border bg-white rounded-md mt-5 p-10">
                    <thead className="sticky-header">
                      <tr className="w-full bg-coolGray-200 text-gray-400 text-start flex  border custom_table_text">
                        <th className="w-[9%] text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 p-1">
                          <p>S.NO</p>
                        </th>
                        <th className="w-3/12 text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 ">
                          <p>Name</p>
                        </th>
                        <th className="w-1/12 text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 ">
                          <p>Age</p>
                        </th>
                        <th className="w-2/12 text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 ">
                          <p>Contact.No</p>
                        </th>
                        <th className="w-3/12 text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 ">
                          <p>Email</p>
                        </th>
                        <th className="w-2/12 text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 ">
                          <p>Block/Unblock</p>
                        </th>
                        <th className="w-2/12 text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 ">
                          <p>Action</p>
                        </th>
                      </tr>
                    </thead>

                    <tbody className="w-full">
                      {Array.isArray(allData) &&
                        allData.map((item, index) => (
                          <tr
                            key={index}
                            className="p-2 text-start flex xl:text-[14px] lg:text-[12px] md:text-[14px] sm:text-[13px] text-[10px]"
                          >
                            <td className=" p-2 w-1/12">{index + 1}</td>
                            <td className="  p-2  w-3/12 capitalize">
                              {item.name}
                            </td>
                            <td className="  w-1/12 p-2 ">{item.age}</td>
                            <td className="  w-2/12 p-2 ">{item.contact}</td>
                            <td className="  w-3/12 p-2 ">{item.email}</td>
                            <td className="  w-2/12 p-2 ">
                              {" "}
                              <Switch
                                checked={item?.isBlocked}
                                onChange={() =>
                                  handleToggleBlocked(
                                    item?._id,
                                    item?.isBlocked
                                  )
                                }
                                className={`${
                                  item?.isBlocked ? "bg-red-800" : "bg-gray-200"
                                } relative inline-flex h-6 w-11 items-center rounded-full`}
                              >
                                <span className="sr-only">
                                  Enable notifications
                                </span>
                                <span
                                  className={`${
                                    item?.isBlocked
                                      ? "translate-x-6"
                                      : "translate-x-1"
                                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                />
                              </Switch>
                            </td>

                            <td className="w-2/12">
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

                  <hr />
                </div>
              </div>
            </div>
          </div>
          ;
        </div>
        <div className=""></div>
      </section>
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
                  <DeleteUser
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
                  <UpdateUser
                    cateEdit={userEdit}
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
                  <AddUser
                    closeDrawer={closeDrawer}
                    refreshData={refreshData}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default User;
