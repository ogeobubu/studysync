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
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
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
  meetingDate: {
    type: Date,
    validate: {
      validator: function(value) {
        // Meeting date must be in the future when scheduled
        return !value || this.status !== 'Scheduled' || value > new Date();
      },
      message: 'Meeting date must be in the future for scheduled appointments'
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

// Virtual for formatted meeting date
AdvisingSchema.virtual('formattedMeetingDate').get(function() {
  if (!this.meetingDate) return null;
  return this.meetingDate.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Pre-save hook to validate advisor assignment
AdvisingSchema.pre('save', async function(next) {
  if (this.isModified('advisor') && this.advisor) {
    const advisor = await mongoose.model('User').findById(this.advisor);
    if (!advisor || advisor.role !== 'advisor') {
      throw new Error('Assigned user must be an advisor');
    }
  }
  next();
});

module.exports = mongoose.model('Advising', AdvisingSchema);