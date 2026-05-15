const Volunteer = require('../models/Volunteer');
const { sendEmail, getVolunteerAcceptedTemplate, getVolunteerRejectedTemplate } = require('../config/email');

const getAll = async (req, res) => {
  try {
    const volunteers = await Volunteer.findAll();
    res.json({ success: true, data: volunteers });
  } catch (error) {
    console.error('Erreur getAll:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const register = async (req, res) => {
  try {
    const volunteer = await Volunteer.create(req.body);
    res.status(201).json({ success: true, data: volunteer });
  } catch (error) {
    if (error.constraint === 'volunteers_email_key') {
      return res.status(400).json({ success: false, message: 'Cet email est déjà inscrit' });
    }
    console.error('Erreur register:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const volunteer = await Volunteer.updateStatus(req.params.id, status);
    
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Bénévole non trouvé' });
    }
    
    // Envoyer un email de confirmation si le statut est "accepted"
    if (status === 'accepted') {
      console.log(`📧 Envoi d'email de bienvenue à ${volunteer.email}`);
      
      const emailHtml = getVolunteerAcceptedTemplate(volunteer.full_name, null);
      const result = await sendEmail(
        volunteer.email,
        'Bienvenue chez Little Dream - Votre candidature est acceptée ! 🎉',
        emailHtml
      );
      
      if (result.success) {
        console.log(`✅ Email de bienvenue envoyé à ${volunteer.email}`);
      } else {
        console.error(`❌ Échec envoi email à ${volunteer.email}:`, result.error);
      }
    }
    
    // Envoyer un email de refus si le statut est "rejected"
    if (status === 'rejected') {
      console.log(`📧 Envoi d'email de suite à ${volunteer.email}`);
      
      const emailHtml = getVolunteerRejectedTemplate(volunteer.full_name, null);
      const result = await sendEmail(
        volunteer.email,
        'Little Dream - Suite de votre candidature',
        emailHtml
      );
      
      if (result.success) {
        console.log(`✅ Email de suite envoyé à ${volunteer.email}`);
      } else {
        console.error(`❌ Échec envoi email à ${volunteer.email}:`, result.error);
      }
    }
    
    res.json({ success: true, data: volunteer });
  } catch (error) {
    console.error('Erreur updateStatus:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await Volunteer.delete(req.params.id);
    res.json({ success: true, message: 'Bénévole supprimé' });
  } catch (error) {
    console.error('Erreur remove:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, register, updateStatus, remove };