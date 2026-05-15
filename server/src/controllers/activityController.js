const Activity = require('../models/Activity');

const getAll = async (req, res) => {
  try {
    const activities = await Activity.findAll();
    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOne = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activité non trouvée' });
    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    let imageUrl = req.body.image_url;
    if (req.file) {
      imageUrl = `/uploads/activities/${req.file.filename}`;
    }
    
    const activity = await Activity.create({ ...req.body, image_url: imageUrl });
    res.status(201).json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    let imageUrl = req.body.image_url;
    if (req.file) {
      imageUrl = `/uploads/activities/${req.file.filename}`;
    }
    
    const activity = await Activity.update(req.params.id, { ...req.body, image_url: imageUrl });
    if (!activity) return res.status(404).json({ success: false, message: 'Activité non trouvée' });
    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await Activity.delete(req.params.id);
    res.json({ success: true, message: 'Activité supprimée' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };