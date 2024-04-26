import axios from "axios";
import React, { useEffect, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import EventDetails from "./eventDetails";
import DeleteModule from "./delete-module";
import { ToastContainer } from "react-toastify";

const AllEvent = () => {
  const token = JSON.parse(localStorage.getItem("admin_token"));
  const [getAllEvent, setGetAllEvent] = useState([]);
  const [isRefresh, setRefresh] = useState(false);
  const [isLoader, setLoader] = useState(false);
  const [isDrawerOpenO, setIsDrawerOpenO] = useState(false);
  const [getAEvent, setGetAEvent] = useState("");
  const [isOpenDelete, setOpenDelete] = useState(false);
  const [id, setId] = useState("");


  const refreshData = () => {
    setRefresh(!isRefresh);
  };




  const moment = require("moment");
  const convertTime = (time) => {
    const parsedDateTime = moment.utc(time);
    const formattedDateTime = parsedDateTime.format("DD/MM/YYYY HH:mm");
    return formattedDateTime;
  };

  const closeEditModal = () => {
    setIsDrawerOpenO(false);
  };

  function openModal(id) {
    setId(id);
    setOpenDelete(true);
  }
  function closeModal() {
    setOpenDelete(false);
  }

  useEffect(() => {
    defaultEvent();
  }, [isRefresh]);

  const defaultEvent = () => {
    const option = {
      method: "POST",
      url: "http://34.242.24.155:5000/api/eventauth/getAllEvent",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    axios
      .request(option)
      .then((response) => {
        setGetAllEvent(response?.data?.data);
        console.log(response?.data?.data, "events");
      })
      .catch((error) => {
        console.log(error, "Error");
      });
  };

  const openDrawerO = async (_id) => {
    setLoader(true);
    try {
      const options = {
        method: "GET",
        url: `http://34.242.24.155:5000/api/eventauth/getEventById/${_id}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      const response = await axios.request(options);
      if (response.status === 200) {
        setGetAEvent(response?.data);
        console.log(response?.data, "A Event");

        setIsDrawerOpenO(true);
        setLoader(false);
      } else {
        console.error("Error: Unexpected response status");
        setLoader(false);
      }
    } catch (error) {
      console.error(error);
      setLoader(false);
    }
  };
  return (
    <>
    <ToastContainer autoClose={1000}/>
      <div className="mt-2 sm:mt-2 lg:mt-3 xl:mt-4 2xl:mt-7 flex justify-between items-center 2xl:px-10 border mx-5 lg:mx-8 bg-white rounded-lg 2xl:h-[100px] xl:h-[70px] lg:h-[60px] md:h-[50px] sm:h-[45px] h-[45px]  xl:px-8 lg:px-5 md:px-4 sm:px-4 px-4">
        <h2 className="font-semibold custom_heading_text">Event List </h2>
      </div>
      <div className=" flex mx-5 lg:mx-8  overflow-x-auto ">
        <div className="  w-full ">
          <div className="overflow-y-scroll  ">
            <div className="h-[300px] xl:h-[400px]">
              <table className="w-[1500px] lg:w-[150%] xl:w-[100%] border bg-white rounded-md mt-5 p-10">
                <thead className="sticky-header">
                  <tr className="w-full bg-coolGray-200 text-gray-400 text-start flex px-2 border custom_table_text">
                    <th className="w-[11%] text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 ">
                      <p>S.NO</p>
                    </th>
                    <th className="xl:pl-0 w-3/12 text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5">
                      <p>EVENT NAME</p>
                    </th>
                    <th className="lg:pl-3 xl:pl-0 text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-2/12">
                      LOCATION
                    </th>
                    <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-2/12">
                      DATE
                    </th>
                    <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-2/12">
                      TIME
                    </th>

                    <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-2/12">
                      PREVIEW
                    </th>
                    <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-2/12">
                        ACTION
                      </th>
                  </tr>
                </thead>

                <tbody className="w-full">
                  {Array.isArray(getAllEvent) &&
                    getAllEvent.length > 0 &&
                    getAllEvent.map((item, index) => (
                      <tr
                        key={item._id}
                        className="p-2 text-start flex xl:text-[14px] lg:text-[12px] md:text-[14px] sm:text-[13px] text-[10px]"
                      >
                        <td className="2xl:py-2 w-[11%] custom_table_text py-2">
                          <p>{index + 1}</p>
                        </td>
                        <td className="2xl:py-2 capitalize w-3/12 xl:pl-[0px] custom_table_text py-2">
                          <p className="w-44">{item.eventName}</p>
                        </td>
                        <td className=" w-2/12 2xl:pl-0 custom_table_text py-2 ">
                          {item.location}
                        </td>
                        <td className="text-start 2xl:py-2 py-2 sm:py-2 md:py-2 lg:py-3 xl:py-2 2xl:py-5 w-2/12">
                          {item?.date ? convertTime(item.date) : ""}
                        </td>
                        <td className=" w-1/12 custom_table_text xl:pl-0 py-2 ">
                          {item.time}
                        </td>

                        <td className=" w-3/12 custom_table_text xl:pl-0 py-1 ">
                          <button
                            onClick={() => openDrawerO(item._id)}
                            className="pl-24"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="w-6 h-6 2xl:w-8 2xl:h-8"
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
                        </td>
                        <td className="w-2/12">
                          <div className="flex my-3 gap-3">
                            {/* <button
                            // onClick={() => openDrawerO(item?._id)}
                            >
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
                            </button> */}
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
      <Transition appear show={isDrawerOpenO} as={Fragment}>
        <Dialog as="div" className="z-10 fixed" onClose={() => {}}>
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
                <Dialog.Panel className=" w-full max-w-[540px] xl:max-w-[700px] 2xl:max-w-[900px] transform overflow-hidden rounded-2xl bg-white p-5 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="flex justify-end lg:text-[20px] text-[16px] font-semibold leading-6 text-gray-900"
                  >
                    {" "}
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className=" text-gray-400  shadow-2xl text-sm   top-2  inline-flex items-center justify-center "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="text-black w-8 h-8"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>

                      <span className="sr-only bg-black">Close menu</span>
                    </button>
                  </Dialog.Title>
                  <EventDetails
                    getAEvent={getAEvent}
                    closeModal={closeEditModal}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

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
                  <DeleteModule
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
    </>
  );
};

export default AllEvent;
