import axios from "axios";
import React, { useEffect, useState } from "react";

const AdminProfile = () => {
  const token = JSON.parse(localStorage.getItem("admin_token"));

  const [adminDetail, setAdminDetail] = useState("");

  useEffect(()=>{
    defaultAdmin();
  },[])

  const defaultAdmin = () => {
    const option = {
      method: "GET",
      url: "http://34.242.24.155:5000/api/adminauth/getAdminById",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };axios.request(option).then((response)=>{
        setAdminDetail(response?.data?.user);
        console.log(response?.data?.user ,"data")
    }).catch((error)=>{
        console.log(error, "Error")
    })
  };

  return <>
    <div>
        <div>
            <p className="text-lg font-medium my-1">Role : {adminDetail.role}</p>
            <p className="text-lg font-medium my-1">Full Name : {adminDetail.fullname}</p>
            <p className="text-lg font-medium my-1">Email : {adminDetail.email}</p>


        </div>
    </div>
  </>;
};

export default AdminProfile;
