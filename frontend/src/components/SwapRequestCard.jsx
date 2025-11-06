import React, { useState, useEffect } from 'react';
import API from '../api/api';

export default function SwapRequestCard({ slot }) {
  const [showModal, setShowModal] = useState(false);
  const [mySlots, setMySlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');

  const fetchMySwappableSlots = async () => {
    try {
      const res = await API.get('/events');
      const swappable = res.data.filter(e => e.status === 'SWAPPABLE');
      setMySlots(swappable);
    } catch (err) {
      console.error('Error fetching my slots:', err);
    }
  };

  const handleRequestSwap = async () => {
    if (!selectedSlot) return alert('Please select one of your swappable slots.');
    try {
      await API.post('/swaps', { mySlotId: selectedSlot, theirSlotId: slot._id });
      alert('Swap request sent successfully!');
      setShowModal(false);
    } catch (err) {
      console.error('Error sending swap request:', err);
      alert(err.response?.data?.message || 'Failed to send swap request.');
    }
  };

  useEffect(() => {
    if (showModal) fetchMySwappableSlots();
  }, [showModal]);

  return (
    <div className="border p-4 rounded shadow-sm flex justify-between items-center">
      <div>
        <div className="font-bold text-lg">{slot.title}</div>
        <div className="text-sm text-gray-600">
          {new Date(slot.startTime).toLocaleString()} - {new Date(slot.endTime).toLocaleString()}
        </div>
        <div className="text-xs text-gray-500">Owner: {slot.owner?.name || 'Unknown User'}</div>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
      >
        Request Swap
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-purple-700">Select Your Slot to Swap</h3>
            {mySlots.length === 0 ? (
              <p className="text-gray-600">You have no swappable slots.</p>
            ) : (
              <select
                className="w-full border p-2 mb-4"
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
              >
                <option value="">-- Select Your Slot --</option>
                {mySlots.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.title} ({new Date(s.startTime).toLocaleString()})
                  </option>
                ))}
              </select>
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestSwap}
                className="px-4 py-2 bg-purple-700 text-white rounded"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
