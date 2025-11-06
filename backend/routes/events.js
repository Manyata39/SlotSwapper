import express from 'express';
import Event from '../models/Event.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// CRUD: Create event
router.post('/', protect, async (req, res) => {
  const { title, startTime, endTime, status } = req.body;
  const event = await Event.create({ title, startTime, endTime, status, owner: req.user._id });
  res.status(201).json(event);
});

// Read all events for user
router.get('/', protect, async (req, res) => {
  const events = await Event.find({ owner: req.user._id });
  res.json(events);
});

// Update event
router.put('/:id', protect, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event || event.owner.toString() !== req.user._id.toString()) return res.status(404).json({ message: 'Event not found' });
  Object.assign(event, req.body);
  await event.save();
  res.json(event);
});

// Delete event
router.delete('/:id', protect, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event || event.owner.toString() !== req.user._id.toString()) return res.status(404).json({ message: 'Event not found' });
  await event.remove();
  res.json({ message: 'Event deleted' });
});

export default router;
