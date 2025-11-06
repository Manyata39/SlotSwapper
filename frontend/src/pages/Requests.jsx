import React, { useEffect, useState } from 'react';
import API from '../api/api';

export default function Requests() {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await API.get('/swaps');
      const { incoming, outgoing } = res.data;
      setIncoming(incoming);
      setOutgoing(outgoing);
    } catch (err) {
      console.error('Error fetching swap requests:', err);
    }
  };

  const handleAction = async (id, action) => {
  try {
    await API.post(`/swaps/${id}/respond`, { accept: action === 'accept' });
    alert(`Swap ${action}ed successfully!`);
    await fetchRequests(); // refresh swaps
    if (typeof fetchEvents === 'function') fetchEvents();
  } catch (err) {
    console.error(`Error ${action}ing swap:`, err);
    alert('Failed to perform action.');
  }
};


  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4 font-semibold text-purple-700">Swap Requests</h2>

      {/* Incoming Requests */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Incoming Requests</h3>
        {incoming.length === 0 ? (
          <p className="text-gray-500">No incoming swap requests.</p>
        ) : (
          <div className="grid gap-4">
            {incoming.map(req => (
              <div
                key={req._id}
                className="border p-4 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-purple-700">
                    {req.fromUser?.name || 'Unknown User'} wants to swap
                  </p>
                  <p className="text-sm text-gray-600">
                    Their slot: {req.theirSlot?.title} ({new Date(req.theirSlot?.startTime).toLocaleString()})
                  </p>
                  <p className="text-sm text-gray-600">
                    For your slot: {req.mySlot?.title} ({new Date(req.mySlot?.startTime).toLocaleString()})
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(req._id, 'accept')}
                    className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(req._id, 'reject')}
                    className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Outgoing Requests */}
      <section>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Outgoing Requests</h3>
        {outgoing.length === 0 ? (
          <p className="text-gray-500">No outgoing swap requests.</p>
        ) : (
          <div className="grid gap-4">
            {outgoing.map(req => (
              <div
                key={req._id}
                className="border p-4 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-purple-700">
                    Requested swap with {req.toUser?.name || 'Unknown User'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Your slot: {req.mySlot?.title} ({new Date(req.mySlot?.startTime).toLocaleString()})
                  </p>
                  <p className="text-sm text-gray-600">
                    Their slot: {req.theirSlot?.title} ({new Date(req.theirSlot?.startTime).toLocaleString()})
                  </p>
                  <p className="text-xs mt-1">
                    Status: <span className="font-semibold">{req.status}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
