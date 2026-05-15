const TeamMember = require('../models/TeamMember');

// Public - Récupérer tous les membres actifs
const getAll = async (req, res) => {
  try {
    const members = await TeamMember.findAll();
    res.json({ success: true, data: members });
  } catch (error) {
    console.error('❌ Erreur getAll:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des membres' });
  }
};

// Admin - Récupérer tous les membres (actifs + inactifs)
const getAllAdmin = async (req, res) => {
  try {
    const members = await TeamMember.findAllAdmin();
    res.json({ success: true, data: members });
  } catch (error) {
    console.error('❌ Erreur getAllAdmin:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des membres' });
  }
};

const getOne = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Membre non trouvé' });
    }
    res.json({ success: true, data: member });
  } catch (error) {
    console.error('❌ Erreur getOne:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération du membre' });
  }
};

const create = async (req, res) => {
  try {
    console.log('📝 Création d\'un nouveau membre');
    console.log('Body reçu:', req.body);
    console.log('Fichier reçu:', req.file ? req.file.filename : 'Aucun fichier');
    
    // Validation des champs requis
    if (!req.body.name || !req.body.name.trim()) {
      return res.status(400).json({ success: false, message: 'Le nom est requis' });
    }
    if (!req.body.position || !req.body.position.trim()) {
      return res.status(400).json({ success: false, message: 'Le poste est requis' });
    }
    
    let imageUrl = req.body.image_url;
    
    // Si un fichier a été uploadé, utiliser son chemin
    if (req.file) {
      imageUrl = `/uploads/team/${req.file.filename}`;
      console.log('✅ Image uploadée:', imageUrl);
    }
    
    const memberData = {
      name: req.body.name.trim(),
      position: req.body.position.trim(),
      bio: req.body.bio || '',
      image_url: imageUrl || '',
      email: req.body.email || '',
      linkedin_url: req.body.linkedin_url || '',
      twitter_url: req.body.twitter_url || '',
      facebook_url: req.body.facebook_url || '',
      display_order: parseInt(req.body.display_order) || 0,
      is_active: req.body.is_active === 'true' || req.body.is_active === true
    };
    
    console.log('📊 Données à insérer:', memberData);
    
    const member = await TeamMember.create(memberData);
    console.log('✅ Membre créé avec succès, ID:', member.id);
    
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    console.error('❌ Erreur détaillée dans create:', error);
    console.error('Stack:', error.stack);
    
    // Message d'erreur plus parlant
    let errorMessage = 'Erreur lors de la création du membre';
    if (error.code === '23505') {
      errorMessage = 'Un membre avec ce nom existe déjà';
    } else if (error.code === '23502') {
      errorMessage = 'Champ requis manquant';
    }
    
    res.status(500).json({ success: false, message: errorMessage, details: error.message });
  }
};

const update = async (req, res) => {
  try {
    console.log(`✏️ Mise à jour du membre ${req.params.id}`);
    console.log('Body reçu:', req.body);
    console.log('Fichier reçu:', req.file ? req.file.filename : 'Aucun fichier');
    
    let imageUrl = req.body.image_url;
    
    // Si un nouveau fichier a été uploadé
    if (req.file) {
      imageUrl = `/uploads/team/${req.file.filename}`;
      console.log('✅ Nouvelle image uploadée:', imageUrl);
    }
    
    const memberData = {
      name: req.body.name.trim(),
      position: req.body.position.trim(),
      bio: req.body.bio || '',
      image_url: imageUrl || '',
      email: req.body.email || '',
      linkedin_url: req.body.linkedin_url || '',
      twitter_url: req.body.twitter_url || '',
      facebook_url: req.body.facebook_url || '',
      display_order: parseInt(req.body.display_order) || 0,
      is_active: req.body.is_active === 'true' || req.body.is_active === true
    };
    
    const member = await TeamMember.update(req.params.id, memberData);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Membre non trouvé' });
    }
    
    console.log('✅ Membre mis à jour avec succès');
    res.json({ success: true, data: member });
  } catch (error) {
    console.error('❌ Erreur détaillée dans update:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour du membre' });
  }
};

const remove = async (req, res) => {
  try {
    console.log(`🗑️ Suppression du membre ${req.params.id}`);
    await TeamMember.delete(req.params.id);
    console.log('✅ Membre supprimé');
    res.json({ success: true, message: 'Membre supprimé' });
  } catch (error) {
    console.error('❌ Erreur remove:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la suppression' });
  }
};

module.exports = { getAll, getAllAdmin, getOne, create, update, remove };