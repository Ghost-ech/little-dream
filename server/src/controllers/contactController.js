const Contact = require('../models/Contact');
const { sendEmail, getReplyTemplate } = require('../config/email');

const getAll = async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markRead = async (req, res) => {
  try {
    const contact = await Contact.markRead(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Message non trouvé' });
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await Contact.delete(req.params.id);
    res.json({ success: true, message: 'Message supprimé' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const reply = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, message, replyTo } = req.body;
    
    // Récupérer le message original
    const originalMessage = await Contact.findById(id);
    if (!originalMessage) {
      return res.status(404).json({ success: false, message: 'Message non trouvé' });
    }
    
    // Construire l'email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #e63946, #f4a261); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h2 style="color: white; margin: 0;">Little Dream Association</h2>
        </div>
        
        <div style="padding: 30px; background: #f8fafc;">
          <p style="font-size: 16px; color: #1a1a2e;">Bonjour <strong>${originalMessage.name}</strong>,</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e63946;">
            <p style="margin: 0; color: #4a5568;">${message.replace(/\n/g, '<br/>')}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #718096; font-size: 14px;">
              Cordialement,<br/>
              <strong>L'équipe Little Dream</strong>
            </p>
            <p style="color: #718096; font-size: 12px; margin-top: 20px;">
              ✉️ littledream.association@gmail.com | 📞 +237 640 420 079 / +237 673 356 881
            </p>
          </div>
        </div>
      </div>
    `;
    
    // Envoyer l'email
    const result = await sendEmail(
      originalMessage.email,
      subject || `Re: ${originalMessage.subject || 'Votre message'} - Little Dream`,
      emailHtml,
      replyTo || process.env.EMAIL_FROM
    );
    
    if (result.success) {
      res.json({ success: true, message: 'Réponse envoyée avec succès' });
    } else {
      res.status(500).json({ success: false, message: result.error });
    }
  } catch (error) {
    console.error('Erreur lors de la réponse:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, create, markRead, remove, reply };