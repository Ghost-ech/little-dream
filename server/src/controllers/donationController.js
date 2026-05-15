const Donation = require('../models/Donation');
const { sendEmail, getDonationConfirmationTemplate, getAdminDonationNotificationTemplate } = require('../config/email');

const getAll = async (req, res) => {
  try {
    const donations = await Donation.findAll();
    res.json({ success: true, data: donations });
  } catch (error) {
    console.error('Erreur getAll:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    console.log('📝 Création d\'un nouveau don');
    console.log('Données reçues:', req.body);
    
    const donation = await Donation.create(req.body);
    console.log('✅ Don créé avec succès, ID:', donation.id);
    
    // Envoyer email de confirmation au donateur (sauf pour cash en attente)
    if (donation.donor_email && donation.payment_status !== 'pending') {
      try {
        const emailHtml = getDonationConfirmationTemplate(
          donation.donor_name || 'Cher donateur',
          donation.amount,
          donation.currency,
          donation.payment_method,
          donation.transaction_id
        );
        
        const result = await sendEmail(
          donation.donor_email,
          `Confirmation de votre don de ${donation.amount} ${donation.currency} - Little Dream`,
          emailHtml
        );
        
        if (result.success) {
          console.log(`✅ Email de confirmation envoyé à ${donation.donor_email}`);
        } else {
          console.error(`❌ Échec envoi email à ${donation.donor_email}:`, result.error);
        }
      } catch (emailErr) {
        console.error('Erreur envoi email confirmation:', emailErr);
      }
    }
    
    // Envoyer notification à l'admin
    try {
      const adminEmail = process.env.EMAIL_USER;
      if (adminEmail) {
        const adminHtml = getAdminDonationNotificationTemplate(donation);
        await sendEmail(
          adminEmail,
          `🔔 Nouveau don de ${donation.amount} ${donation.currency}`,
          adminHtml
        );
        console.log(`✅ Notification admin envoyée à ${adminEmail}`);
      }
    } catch (adminErr) {
      console.error('Erreur envoi notification admin:', adminErr);
    }
    
    res.status(201).json({ success: true, data: donation });
  } catch (error) {
    console.error('❌ Erreur création don:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const status = req.body.payment_status ?? req.body.status;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Statut manquant' });
    }
    const donation = await Donation.updateStatus(req.params.id, status);

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Don non trouvé' });
    }

    // Si le statut passe à "confirmed", envoyer un email de confirmation
    if (status === 'confirmed' && donation.donor_email) {
      try {
        const emailHtml = getDonationConfirmationTemplate(
          donation.donor_name || 'Cher donateur',
          donation.amount,
          donation.currency,
          donation.payment_method,
          donation.transaction_id
        );
        
        const result = await sendEmail(
          donation.donor_email,
          `Confirmation de votre don de ${donation.amount} ${donation.currency} - Little Dream`,
          emailHtml
        );
        
        if (result.success) {
          console.log(`✅ Email de confirmation envoyé à ${donation.donor_email}`);
        }
      } catch (emailErr) {
        console.error('Erreur envoi email confirmation:', emailErr);
      }
    }
    
    res.json({ success: true, data: donation });
  } catch (error) {
    console.error('Erreur updateStatus:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const stats = await Donation.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Erreur getStats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, create, updateStatus, getStats };