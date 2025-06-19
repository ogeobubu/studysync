const mongoose = require('mongoose');

const AdvisingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  additionalInfo: {
    type: String,
  },
  preferredDay: {
    type: String,
  },
  preferredTime: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'Scheduled', 'Completed'],
    default: 'Pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Advising', AdvisingSchema);
