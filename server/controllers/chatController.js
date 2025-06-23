const Chat = require('../models/Chat');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Get all chats for current user
 * @route   GET /api/v1/chats
 * @access  Private
 */
exports.getChats = asyncHandler(async (req, res, next) => {
  const chats = await Chat.find({
    $or: [
      { student: req.user._id },
      { advisor: req.user._id }
    ],
    isActive: true
  })
  .populate('student advisor', 'name profilePhoto')
  .populate('appointment', 'date time')
  .sort('-updatedAt');

  res.status(200).json({
    success: true,
    count: chats.length,
    data: chats
  });
});

/**
 * @desc    Get messages for specific chat
 * @route   GET /api/v1/chats/:chatId
 * @access  Private
 */
exports.getChatMessages = asyncHandler(async (req, res, next) => {
  const chat = await Chat.findOne({
    _id: req.params.chatId,
    $or: [
      { student: req.user._id },
      { advisor: req.user._id }
    ]
  })
  .populate('messages.sender', 'name profilePhoto')
  .populate('appointment', 'date time')
  .populate('advisor', 'name profilePhoto email');

  if (!chat) {
    return next(new ErrorResponse('Chat not found or unauthorized', 404));
  }

  res.status(200).json({
    success: true,
    count: chat.messages.length,
    data: {
      chat: {
        _id: chat._id,
        isActive: chat.isActive,
        appointment: chat.appointment,
        advisor: chat.advisor
      },
      messages: chat.messages
    }
  });
});

/**
 * @desc    Send message in chat
 * @route   POST /api/v1/chats/:chatId/messages
 * @access  Private
 */
exports.sendMessage = asyncHandler(async (req, res, next) => {
  if (!req.body.content || req.body.content.trim() === '') {
    return next(new ErrorResponse('Message content is required', 400));
  }

  const chat = await Chat.findOne({
    _id: req.params.chatId,
    $or: [
      { student: req.user._id },
      { advisor: req.user._id }
    ],
    isActive: true
  });

  if (!chat) {
    return next(new ErrorResponse('Chat not found or unauthorized', 404));
  }

  // Check if there's an active appointment
  if (chat.appointment) {
    const appointment = await Appointment.findById(chat.appointment);
    const now = new Date();
    const appointmentTime = new Date(`${appointment.date}T${appointment.time}`);
    
    // Allow messages 15 minutes before and 1 hour after appointment
    const bufferBefore = 15 * 60 * 1000; // 15 minutes
    const bufferAfter = 60 * 60 * 1000; // 1 hour
    
    if (now < appointmentTime - bufferBefore || now > appointmentTime + bufferAfter) {
      return next(new ErrorResponse('Messaging is only available 15 minutes before and up to 1 hour after the scheduled appointment time', 400));
    }
  }

  const message = {
    sender: req.user._id,
    content: req.body.content.trim()
  };

  chat.messages.push(message);
  chat.updatedAt = new Date();
  await chat.save();

  const populatedChat = await Chat.populate(chat, {
    path: 'messages.sender',
    select: 'name profilePhoto'
  });

  const newMessage = populatedChat.messages[populatedChat.messages.length - 1];

  res.status(201).json({
    success: true,
    data: newMessage
  });
});

/**
 * @desc    Start new chat with advisor
 * @route   POST /api/v1/chats/start
 * @access  Private (Student only)
 */
exports.startChat = asyncHandler(async (req, res, next) => {
  const { advisorId } = req.body;

  if (!advisorId) {
    return next(new ErrorResponse('Advisor ID is required', 400));
  }

  // Check if advisor exists
  const advisor = await User.findById(advisorId);
  if (!advisor || advisor.role !== 'advisor') {
    return next(new ErrorResponse('Invalid advisor', 400));
  }

  // Check for existing active chat
  const existingChat = await Chat.findOne({
    student: req.user._id,
    advisor: advisorId,
    isActive: true
  });

  if (existingChat) {
    return res.status(200).json({
      success: true,
      data: existingChat
    });
  }

  // Check for upcoming appointment
  const appointment = await Appointment.findOne({
    user: req.user._id,
    advisor: advisorId,
    date: { $gte: new Date().toISOString().split('T')[0] },
    status: 'confirmed'
  }).sort('date');

  const chat = await Chat.create({
    student: req.user._id,
    advisor: advisorId,
    appointment: appointment?._id,
    isActive: true
  });

  const populatedChat = await Chat.findById(chat._id)
    .populate('student advisor', 'name profilePhoto')
    .populate('appointment', 'date time');

  res.status(201).json({
    success: true,
    data: populatedChat
  });
});

/**
 * @desc    Close a chat
 * @route   PATCH /api/v1/chats/:chatId/close
 * @access  Private
 */
exports.closeChat = asyncHandler(async (req, res, next) => {
  const chat = await Chat.findOneAndUpdate(
    {
      _id: req.params.chatId,
      $or: [
        { student: req.user._id },
        { advisor: req.user._id }
      ],
      isActive: true
    },
    { isActive: false },
    { new: true }
  );

  if (!chat) {
    return next(new ErrorResponse('Chat not found or unauthorized', 404));
  }

  res.status(200).json({
    success: true,
    data: chat
  });
});