import express from 'express';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events with rich filtering, search & sorting
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, mode, price, sort } = req.query;

    const query = {};

    // Filter by Category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by Mode
    if (mode && mode !== 'All') {
      query.mode = mode;
    }

    // Filter by Price (Free vs Paid)
    if (price === 'free') {
      query.entryFee = 0;
    } else if (price === 'paid') {
      query.entryFee = { $gt: 0 };
    }

    // Search keyword
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { club: searchRegex },
        { tags: searchRegex },
        { venue: searchRegex },
      ];
    }

    // Sort order
    let sortQuery = { createdAt: -1 };
    if (sort === 'date_asc') {
      sortQuery = { date: 1 };
    } else if (sort === 'popular') {
      sortQuery = { registeredCount: -1 };
    } else if (sort === 'capacity') {
      sortQuery = { capacity: -1 };
    }

    const events = await Event.find(query).sort(sortQuery);

    return res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve events from MongoDB.',
    });
  }
});

// @route   GET /api/events/featured
// @desc    Get featured spotlight events
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const featuredEvents = await Event.find({ isFeatured: true }).limit(6);
    // If none flagged featured, return highest registered ones
    if (featuredEvents.length === 0) {
      const popular = await Event.find().sort({ registeredCount: -1 }).limit(6);
      return res.status(200).json({ success: true, events: popular });
    }
    return res.status(200).json({
      success: true,
      events: featuredEvents,
    });
  } catch (error) {
    console.error('Error fetching featured events:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve featured events.',
    });
  }
});

// @route   GET /api/events/stats/summary
// @desc    Get global statistics for EventHive platform
// @access  Public
router.get('/stats/summary', async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments();

    // Aggregate unique clubs
    const clubsList = await Event.distinct('club');

    // Aggregate category counts
    const categoryStats = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalSeats: { $sum: '$capacity' } } },
      { $sort: { count: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalEvents,
        totalRegistrations,
        activeClubs: clubsList.length,
        categories: categoryStats,
      },
    });
  } catch (error) {
    console.error('Error fetching event stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to compute statistics.',
    });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event details with organizer & registration info
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found in MongoDB.',
      });
    }

    return res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error('Error fetching event detail:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve event details.',
    });
  }
});

// @route   POST /api/events
// @desc    Create a new event and save into MongoDB
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      title,
      tagline,
      description,
      category,
      club,
      college,
      venue,
      mode,
      date,
      time,
      registrationDeadline,
      entryFee,
      prizePool,
      teamSize,
      capacity,
      bannerUrl,
      tags,
      schedule,
      rules,
      contactEmail,
      contactPhone,
      isFeatured,
    } = req.body;

    if (!title || !description || !venue || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Title, Description, Venue, and Date for the event.',
      });
    }

    const event = await Event.create({
      title: title.trim(),
      tagline: tagline?.trim() || '',
      description: description.trim(),
      category: category || 'Tech Fest',
      club: club?.trim() || req.user.clubAffiliation || 'Campus Student Club',
      college: college?.trim() || req.user.college || 'Apex Institute of Technology',
      venue: venue.trim(),
      mode: mode || 'In-Person',
      date,
      time: time || '10:00 AM - 04:00 PM',
      registrationDeadline: registrationDeadline || date,
      entryFee: Number(entryFee) || 0,
      prizePool: prizePool?.trim() || 'Exciting Prizes & Certificates',
      teamSize: teamSize || 'Team of 2 - 4',
      capacity: Number(capacity) || 150,
      bannerUrl:
        bannerUrl?.trim() ||
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
      tags: Array.isArray(tags) && tags.length > 0 ? tags : [category || 'Campus'],
      schedule: Array.isArray(schedule) ? schedule : [],
      rules: Array.isArray(rules) ? rules : [],
      organizer: req.user._id,
      organizerName: req.user.name,
      contactEmail: contactEmail?.trim() || req.user.email,
      contactPhone: contactPhone?.trim() || '+91 98765 43210',
      isFeatured: Boolean(isFeatured),
    });

    console.log(`[EventHive] New event created in MongoDB: "${event.title}" by ${req.user.name}`);

    return res.status(201).json({
      success: true,
      message: 'Event created and published to MongoDB successfully!',
      event,
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create event.',
    });
  }
});

// @route   PUT /api/events/:id
// @desc    Update an event
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // Allow author or admin
    if (event.organizer && event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this event.',
      });
    }

    Object.assign(event, req.body);
    await event.save();

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully in MongoDB!',
      event,
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update event.',
    });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    if (event.organizer && event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this event.',
      });
    }

    await Event.findByIdAndDelete(req.params.id);
    // Also remove associated registrations
    await Registration.deleteMany({ event: req.params.id });

    return res.status(200).json({
      success: true,
      message: 'Event and associated registrations deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete event.',
    });
  }
});

export default router;
