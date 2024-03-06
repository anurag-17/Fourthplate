import React from "react";
import moment from "moment";

const EventDetails = ({ getAEvent }) => {
  const eventDetails = getAEvent.event;

  const convertTime = (time) => {
    const formattedDateTime = moment.utc(time).format("DD/MM/YYYY HH:mm");
    return formattedDateTime;
  };

  return (
    <div>
      <div>
        <img src={eventDetails.images} alt="Event" className="w-[50%] mx-auto" />
      </div>
     <div className="flex justify-center my-5" >
     <div className="w-[50%]">
     <p className="my-1 font-semibold text-lg">Event Name: {eventDetails.eventName}</p>
      <p className="my-1 font-semibold text-lg">
        Event Date: {eventDetails?.date ? convertTime(eventDetails.date) : ""}
      </p>
      <p className="my-1 font-semibold text-lg">Location: {eventDetails.location}</p>
      <p className="my-1 font-semibold text-lg">Time: {eventDetails.time}</p>
      <p className="my-1 font-semibold text-lg">Capacity: {eventDetails.allowMember}</p>
     </div>
     </div>
    </div>
  );
};

export default EventDetails;
