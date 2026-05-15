const Event = require('../models/Event');

const getAll = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPublished = async (req, res) => {
  try {
    const events = await Event.findPublished();
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOne = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Événement non trouvé' });
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    let imageUrl = req.body.image_url;
    if (req.file) {
      imageUrl = `/uploads/events/${req.file.filename}`;
    }

    const event = await Event.create({ ...req.body, image_url: imageUrl });
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    let imageUrl = req.body.image_url;
    if (req.file) {
      imageUrl = `/uploads/events/${req.file.filename}`;
    }

    const event = await Event.update(req.params.id, { ...req.body, image_url: imageUrl });
    if (!event) return res.status(404).json({ success: false, message: 'Événement non trouvé' });
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await Event.delete(req.params.id);
    res.json({ success: true, message: 'Événement supprimé' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getPublished, getOne, create, update, remove };