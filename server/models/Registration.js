import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event reference is required'],
    },
    ticketCode: {
      type: String,
      required: true,
      unique: true,
    },
    teamName: {
      type: String,
      default: '',
      trim: true,
    },
    teamMembers: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['confirmed', 'waitlisted', 'attended', 'cancelled'],
      default: 'confirmed',
    },
    attendanceCheckedIn: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: '',
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate active registration for the same user on the same event
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;
