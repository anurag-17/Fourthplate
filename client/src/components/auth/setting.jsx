import React from "react";
import ChangePassword from "./ChangePassword";


const Setting = () => {

  return (
    <>
    <div className="mt-2 sm:mt-2 lg:mt-3 xl:mt-4 2xl:mt-7 flex justify-between items-center 2xl:px-10 border mx-5 lg:mx-8 bg-white rounded-lg 2xl:h-[100px] xl:h-[70px] lg:h-[60px] md:h-[50px] sm:h-[45px] h-[45px]  xl:px-8 lg:px-5 md:px-4 sm:px-4 px-4">
            <h2 className="font-semibold custom_heading_text">Profile Setting </h2>
          </div>
      <div className="flex justify-center mt-10">
        <div className="w-2/3">
          <div className="collapse collapse-arrow bg-base-200 border-2">
            <input type="radio" name="my-accordion-2" defaultChecked />
            <div className="collapse-title text-xl font-medium">
              Profile
            </div>
            <div className="collapse-content">
              <p>hello</p>
            </div>
          </div>
          <div className="collapse collapse-arrow bg-base-200 border-2 mt-5">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title text-xl font-medium">
            Password Update
            </div>
            <div className="collapse-content">
             <ChangePassword/>
            </div>
          </div>
         
        </div>
      </div>
    </>
  );
};

export default Setting;
