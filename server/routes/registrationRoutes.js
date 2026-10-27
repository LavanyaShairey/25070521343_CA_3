import express from 'express';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper to generate ticket code
const generateTicketCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomStr = '';
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `EH-${new Date().getFullYear()}-${randomStr}`;
};

// @route   POST /api/registrations/:eventId
// @desc    Register / RSVP for an event
// @access  Private
router.post('/:eventId', protect, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { teamName, teamMembers, notes } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found in MongoDB.',
      });
    }

    // Check if user already registered
    const existingReg = await Registration.findOne({
      user: req.user._id,
      event: eventId,
    });

    if (existingReg) {
      return res.status(400).json({
        success: false,
        message: 'You have already registered for this event! Check your "My Passes" section.',
        ticketCode: existingReg.ticketCode,
      });
    }

    // Check capacity
    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Sorry, this event has reached full capacity!',
      });
    }

    // Create registration record
    const ticketCode = generateTicketCode();
    const registration = await Registration.create({
      user: req.user._id,
      event: eventId,
      ticketCode,
      teamName: teamName?.trim() || '',
      teamMembers: Array.isArray(teamMembers) ? teamMembers : [],
      notes: notes?.trim() || '',
      status: 'confirmed',
      registeredAt: new Date(),
    });

    // Increment registered count on the event
    event.registeredCount = (event.registeredCount || 0) + 1;
    await event.save();

    // Populate event info
    await registration.populate('event');

    console.log(`[EventHive Registration] User ${req.user.name} registered for "${event.title}" with Ticket: ${ticketCode}`);

    return res.status(201).json({
      success: true,
      message: 'Registration confirmed! Digital Pass generated and saved to MongoDB.',
      registration,
      ticketCode,
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already registered for this event.',
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to complete registration.',
    });
  }
});

// @route   GET /api/registrations/my-tickets
// @desc    Get all digital tickets registered by the logged-in student
// @access  Private
router.get('/my-tickets', protect, async (req, res) => {
  try {
    const tickets = await Registration.find({ user: req.user._id })
      .populate('event')
      .sort({ registeredAt: -1 });

    return res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve your tickets from MongoDB.',
    });
  }
});

// @route   GET /api/registrations/check/:eventId
// @desc    Check if logged-in user is already registered for this event
// @access  Private
router.get('/check/:eventId', protect, async (req, res) => {
  try {
    const registration = await Registration.findOne({
      user: req.user._id,
      event: req.params.eventId,
    });

    return res.status(200).json({
      success: true,
      isRegistered: !!registration,
      ticket: registration || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to check registration status.',
    });
  }
});

// @route   DELETE /api/registrations/:id
// @desc    Cancel an RSVP / registration
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const registration = await Registration.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration ticket not found.',
      });
    }

    const eventId = registration.event;
    await Registration.findByIdAndDelete(req.params.id);

    // Decrement event registered count
    if (eventId) {
      await Event.findByIdAndUpdate(eventId, {
        $inc: { registeredCount: -1 },
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully.',
    });
  } catch (error) {
    console.error('Error cancelling registration:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to cancel registration.',
    });
  }
});

export default router;
