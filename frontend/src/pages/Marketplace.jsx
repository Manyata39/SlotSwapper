import React, { useEffect, useState } from 'react';
import API from '../api/api';
import SwapRequestCard from '../components/SwapRequestCard';

export default function Marketplace() {
  const [slots, setSlots] = useState([]);

  const fetchSlots = async () => {
    try {
      const res = await API.get('/swaps/swappable');
      setSlots(res.data);
    } catch (err) {
      console.error('Error fetching swappable slots:', err);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4 font-semibold text-purple-700">Marketplace</h2>
      {slots.length === 0 ? (
        <p className="text-gray-500">No swappable slots available right now.</p>
      ) : (
        <div className="grid gap-4">
          {slots.map(slot => (
            <SwapRequestCard key={slot._id} slot={slot} />
          ))}
        </div>
      )}
    </div>
  );
}
