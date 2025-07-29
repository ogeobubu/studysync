const mongoose = require('mongoose');

const AdvisingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
  },
  advisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: async function(value) {
        if (!value) return true; // Advisor is optional
        const user = await mongoose.model('User').findById(value);
        return user && user.role === 'advisor';
      },
      message: 'Advisor must reference a valid advisor user'
    }
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    enum: {
      values: [
        'course-selection',
        'degree-planning',
        'academic-concerns',
        'career-guidance',
        'other'
      ],
      message: 'Invalid reason value'
    }
  },
  additionalInfo: {
    type: String,
    maxlength: [1000, 'Additional info cannot exceed 1000 characters']
  },
  preferredDays: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  }],
  preferredTimeRange: {
    start: {
      type: String,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:MM format']
    },
    end: {
      type: String,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:MM format']
    }
  },
  status: {
    type: String,
    enum: {
      values: ['Pending', 'Assigned', 'Scheduled', 'Completed', 'Cancelled'],
      message: 'Invalid status value'
    },
    default: 'Pending'
  },
  appointment: {
    title: {
      type: String,
      required: function() { return this.status === 'Scheduled'; }
    },
    date: {
      type: Date,
      required: function() { return this.status === 'Scheduled'; },
      validate: {
        validator: function(value) {
          return !value || value > new Date();
        },
        message: 'Appointment date must be in the future'
      }
    },
    time: {
      type: String,
      required: function() { return this.status === 'Scheduled'; },
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:MM format']
    },
    location: {
      type: String,
      maxlength: [200, 'Location cannot exceed 200 characters']
    },
    meetingLink: {
      type: String,
      maxlength: [500, 'Meeting link cannot exceed 500 characters']
    }
  },
  notes: {
    advisorNotes: {
      type: String,
      maxlength: [2000, 'Notes cannot exceed 2000 characters']
    },
    adminNotes: {
      type: String,
      maxlength: [2000, 'Notes cannot exceed 2000 characters']
    }
  },
  attachments: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
AdvisingSchema.index({ user: 1 });
AdvisingSchema.index({ advisor: 1 });
AdvisingSchema.index({ status: 1 });
AdvisingSchema.index({ createdAt: -1 });
AdvisingSchema.index({ 'appointment.date': 1 });

// Virtual for formatted meeting date
AdvisingSchema.virtual('formattedMeetingDate').get(function() {
  if (!this.appointment?.date) return null;
  return this.appointment.date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Virtual for upcoming appointments (status: Scheduled)
AdvisingSchema.virtual('isUpcoming').get(function() {
  return this.status === 'Scheduled' && this.appointment?.date > new Date();
});

// Pre-save hooks
AdvisingSchema.pre('save', async function(next) {
  // Validate advisor assignment
  if (this.isModified('advisor') && this.advisor) {
    const advisor = await mongoose.model('User').findById(this.advisor);
    if (!advisor || advisor.role !== 'advisor') {
      throw new Error('Assigned user must be an advisor');
    }
  }

  // Validate appointment data when status is Scheduled
  if (this.status === 'Scheduled') {
    if (!this.appointment?.title || !this.appointment?.date || !this.appointment?.time) {
      throw new Error('Appointment requires title, date and time when status is Scheduled');
    }
    if (this.appointment.date <= new Date()) {
      throw new Error('Appointment date must be in the future');
    }
  }

  next();
});

// Static method to find upcoming appointments
AdvisingSchema.statics.findUpcoming = function() {
  return this.find({ 
    status: 'Scheduled',
    'appointment.date': { $gt: new Date() }
  });
};

// Static method to find appointments by advisor
AdvisingSchema.statics.findByAdvisor = function(advisorId) {
  return this.find({ advisor: advisorId });
};

// Static method to find appointments by student
AdvisingSchema.statics.findByStudent = function(studentId) {
  return this.find({ user: studentId });
};

module.exports = mongoose.model('Advising', AdvisingSchema);