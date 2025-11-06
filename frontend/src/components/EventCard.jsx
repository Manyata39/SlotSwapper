import React from "react";
import API from "../api/api";

export default function EventCard({ event, onUpdate }) {
  const toggleSwappable = async () => {
    try {
      const newStatus =
        event.status === "SWAPPABLE" ? "BUSY" : "SWAPPABLE";
      await API.put(`/events/${event._id}`, { status: newStatus });
      onUpdate(); // refresh list after update
    } catch (err) {
      alert("Error updating event status");
      console.error(err);
    }
  };

  return (
    <div className="p-3 border rounded flex justify-between items-center shadow-sm">
      <div>
        <div className="font-semibold text-lg">{event.title}</div>
        <div className="text-sm text-gray-600">
          {new Date(event.startTime).toLocaleString()} –{" "}
          {new Date(event.endTime).toLocaleString()}
        </div>
        <div
          className={`text-xs ${
            event.status === "SWAPPABLE"
              ? "text-green-600"
              : "text-gray-500"
          }`}
        >
          Status: {event.status}
        </div>
      </div>

      <button
        onClick={toggleSwappable}
        className="bg-purple-700 text-white px-3 py-1 rounded hover:bg-purple-800"
      >
        {event.status === "SWAPPABLE" ? "Mark Busy" : "Mark Swappable"}
      </button>
    </div>
  );
}
