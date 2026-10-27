import mongoose from 'mongoose';

const scheduleItemSchema = new mongoose.Schema(
  {
    time: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    speaker: { type: String, default: '' },
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    tagline: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Hackathon',
        'Cultural Fest',
        'Tech Fest',
        'Workshop',
        'Sports & E-Sports',
        'Seminar & Talk',
        'Design & Arts',
        'Club Meet',
      ],
      default: 'Tech Fest',
    },
    club: {
      type: String,
      required: [true, 'Organizing club or society name is required'],
      trim: true,
      default: 'Student Activities Council',
    },
    college: {
      type: String,
      default: 'Apex Institute of Technology',
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue or lab location is required'],
      trim: true,
    },
    mode: {
      type: String,
      enum: ['In-Person', 'Hybrid', 'Online'],
      default: 'In-Person',
    },
    date: {
      type: String,
      required: [true, 'Event date is required'],
    },
    time: {
      type: String,
      required: [true, 'Event time range is required'],
      default: '10:00 AM - 04:00 PM',
    },
    registrationDeadline: {
      type: String,
      default: '',
    },
    entryFee: {
      type: Number,
      default: 0, // 0 means Free
      min: 0,
    },
    prizePool: {
      type: String,
      default: '₹25,000 + Goodies',
    },
    teamSize: {
      type: String,
      default: 'Team of 2 - 4',
    },
    capacity: {
      type: Number,
      default: 150,
      min: 1,
    },
    registeredCount: {
      type: Number,
      default: 0,
    },
    bannerUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
    },
    tags: {
      type: [String],
      default: ['Campus', 'College', 'Event'],
    },
    schedule: {
      type: [scheduleItemSchema],
      default: [],
    },
    rules: {
      type: [String],
      default: [],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    organizerName: {
      type: String,
      default: 'Student Affairs Council',
    },
    contactEmail: {
      type: String,
      default: 'events@college.edu',
    },
    contactPhone: {
      type: String,
      default: '+91 98765 43210',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for search
eventSchema.index({ title: 'text', description: 'text', club: 'text', tags: 'text' });

const Event = mongoose.model('Event', eventSchema);

export default Event;
