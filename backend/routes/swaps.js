import express from 'express';
import Event from '../models/Event.js';
import SwapRequest from '../models/SwapRequest.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ✅ GET /api/swaps
router.get('/', protect, async (req, res) => {
  const incoming = await SwapRequest.find({ toUser: req.user._id })
    .populate('fromUser toUser mySlot theirSlot');
  const outgoing = await SwapRequest.find({ fromUser: req.user._id })
    .populate('fromUser toUser mySlot theirSlot');

  res.json({ incoming, outgoing });
});

// ✅ GET /api/swaps/swappable
router.get('/swappable', protect, async (req, res) => {
  const slots = await Event.find({ status: 'SWAPPABLE', owner: { $ne: req.user._id } })
    .populate('owner', 'name email');
  res.json(slots);
});

// ✅ POST /api/swaps
router.post('/', protect, async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;

  const mySlot = await Event.findById(mySlotId);
  const theirSlot = await Event.findById(theirSlotId);
  if (!mySlot || !theirSlot)
    return res.status(404).json({ message: 'Slot not found' });

  if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE')
    return res.status(400).json({ message: 'Both slots must be swappable' });

  const swap = await SwapRequest.create({
    mySlot: mySlot._id,
    theirSlot: theirSlot._id,
    fromUser: req.user._id,
    toUser: theirSlot.owner,
  });

  mySlot.status = 'SWAP_PENDING';
  theirSlot.status = 'SWAP_PENDING';
  await mySlot.save();
  await theirSlot.save();

  res.status(201).json(swap);
});

// ✅ POST /api/swaps/:id/respond
router.post('/:id/respond', protect, async (req, res) => {
  try {
    const { accept } = req.body;
    const swap = await SwapRequest.findById(req.params.id)
      .populate('mySlot')
      .populate('theirSlot')
      .populate('fromUser')
      .populate('toUser');

    if (!swap || swap.toUser._id.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Swap not found or unauthorized' });
    }

    if (accept) {
      swap.status = 'ACCEPTED';

      // ✅ Swap owners properly and persist to DB
      const mySlot = await Event.findById(swap.mySlot._id);
      const theirSlot = await Event.findById(swap.theirSlot._id);

      const tempOwner = mySlot.owner;
      mySlot.owner = theirSlot.owner;
      theirSlot.owner = tempOwner;

      mySlot.status = 'BUSY';
      theirSlot.status = 'BUSY';

      await mySlot.save();
      await theirSlot.save();
    } else {
      swap.status = 'REJECTED';

      const mySlot = await Event.findById(swap.mySlot._id);
      const theirSlot = await Event.findById(swap.theirSlot._id);

      mySlot.status = 'SWAPPABLE';
      theirSlot.status = 'SWAPPABLE';

      await mySlot.save();
      await theirSlot.save();
    }

    await swap.save();

    res.json({ message: `Swap ${accept ? 'accepted' : 'rejected'} successfully`, swap });
  } catch (err) {
    console.error('Swap respond error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;

