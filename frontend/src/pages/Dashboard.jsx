import React, { useEffect, useState } from "react";
import API from "../api/api";
import EventCard from "../components/EventCard";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const addEvent = async (e) => {
    e.preventDefault();
    try {
      await API.post("/events", { title, startTime, endTime });
      setTitle("");
      setStartTime("");
      setEndTime("");
      fetchEvents();
    } catch (err) {
      alert("Failed to add event");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4 font-semibold text-purple-700">My Events</h2>

      {/* Add Event Form */}
      <form onSubmit={addEvent} className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Title"
          className="border p-2 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          className="border p-2 w-full"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          className="border p-2 w-full"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-purple-700 text-white px-4 py-2 rounded"
        >
          Add Event
        </button>
      </form>

      {/* Event List */}
      {events.length === 0 ? (
        <p className="text-gray-500">No events yet. Add one above!</p>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <EventCard key={event._id} event={event} onUpdate={fetchEvents} />
          ))}
        </div>
      )}
    </div>
  );
}
