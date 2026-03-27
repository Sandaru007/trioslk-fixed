const Event = require('../models/Event');
const Registration = require('../models/Registration');

// Helper function to validate event input
const validateEventInput = (data, hasFile) => {
  const errors = {};

  if (!data.eventId || typeof data.eventId !== 'string' || data.eventId.trim() === '') {
    errors.eventId = 'Event ID is required (e.g., EVT-1001)';
  }

  if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
    errors.title = 'Event title is required';
  }

  if (!data.description || typeof data.description !== 'string' || data.description.trim() === '') {
    errors.description = 'Event description is required';
  }

  if (!data.type || !['Online', 'Physical'].includes(data.type)) {
    errors.type = 'Event type must be either Online or Physical';
  }

  if (!data.status || !['Upcoming', 'Ongoing','Extended', 'Completed'].includes(data.status)) {
    errors.status = 'Event status must be Upcoming, Ongoing, Extended, or Completed';
  }

  if (!hasFile) {
    errors.imageFile = 'Event image file is required';
  }

  return errors;
};

// @desc    Get All Events (Admin Use - Includes Completed)
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events' });
  }
};

// @desc    Get Public Events (Website Use - Excludes Completed)
const getPublicEvents = async (req, res) => {
  try {
    // Only show Upcoming, Ongoing, and Extended
    const events = await Event.find({ status: { $ne: 'Completed' } }).sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching public events' });
  }
};

// @desc    Create a new event
// @route   POST /api/events
const createEvent = async (req, res) => {
  try {
    console.log('Creating event - Body:', req.body);
    console.log('Creating event - File:', req.file);

    // Validate input including file upload
    const validationErrors = validateEventInput(req.body, req.file);
    if (Object.keys(validationErrors).length > 0) {
      console.log('Validation errors:', validationErrors);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Create event with validated data and file path from Cloudinary
    const newEvent = await Event.create({
      eventId: req.body.eventId,
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      status: req.body.status,
      imageFile: req.file.path // Cloudinary file path
    });

    console.log('Event created successfully:', newEvent);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message,
      details: error.stack
    });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
const updateEvent = async (req, res) => {
  try {
    // Check if event exists
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Build update data
    const updateData = {};
    const allowedFields = ['eventId', 'title', 'description', 'type', 'status'];
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    // If new file is uploaded, update imageFile
    if (req.file) {
      updateData.imageFile = req.file.path;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    // Validate the update data with current file
    const fullData = { ...event.toObject(), ...updateData };
    const validationErrors = validateEventInput(fullData, req.file || event.imageFile);
    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
};

// @desc    Delete Event + Cascade Delete Registrations
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // 1. Delete all registrations linked to this Event ID
    await Registration.deleteMany({ eventCustomId: event.eventId });

    // 2. Delete the event itself
    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Event and all registrations deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};

module.exports = { getEvents, getPublicEvents, createEvent, updateEvent, deleteEvent };