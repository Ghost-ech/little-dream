const nodemailer = require('nodemailer');

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true pour 465, false pour 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Vérifier la connexion
transporter.verify((error, success) => {
  if (error) {
    console.error(' Erreur de configuration email:', error);
  } else {
    console.log(' Serveur email prêt à envoyer des messages');
  }
});

// Fonction pour envoyer un email
const sendEmail = async (to, subject, html, replyTo = null) => {
  try {
    const info = await transporter.sendMail({
      from: `"Little Dream Association" <${process.env.EMAIL_FROM || 'littledream.association@gmail.com'}>`,
      to: to,
      subject: subject,
      html: html,
      replyTo: replyTo
    });
    console.log(' Email envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(' Erreur envoi email:', error);
    return { success: false, error: error.message };
  }
};




/**
 * Génère un template HTML pour l'acceptation d'un bénévole
 * @param {string} volunteerName - Nom du bénévole
 * @param {string} message - Message personnalisé
 * @returns {string} Template HTML
 */
const getVolunteerAcceptedTemplate = (volunteerName, message = null) => {
  const currentYear = new Date().getFullYear();
  const defaultMessage = message || "Nous avons été ravis de découvrir votre profil et votre motivation. Votre engagement est précieux pour nous aider à réaliser notre mission auprès des jeunes camerounais.";
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenue chez Little Dream</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        
        <!-- En-tête -->
        <div style="background: linear-gradient(135deg, #57cc04 0%, #118ab2 100%); padding: 30px 20px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 10px;">🎉✋</div>
          <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 2px;">BIENVENUE CHEZ LITTLE DREAM</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Votre candidature a été acceptée !</p>
        </div>
        
        <!-- Contenu -->
        <div style="padding: 35px 30px;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Cher/Chère <strong style="color: #57cc04;">${volunteerName}</strong>,
          </p>
          
          <p style="font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 20px;">
            C'est avec une grande joie que nous vous annonçons l'acceptation de votre candidature en tant que bénévole au sein de l'association <strong>Little Dream</strong>.
          </p>
          
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #57cc04;">
            <p style="margin: 0 0 10px 0; color: #166534; font-size: 13px;">
              🌟 <strong>Félicitations !</strong>
            </p>
            <p style="margin: 0; color: #166534; line-height: 1.6; font-size: 14px;">
              ${defaultMessage}
            </p>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h3 style="color: #333; font-size: 16px; margin-bottom: 15px;">📋 Prochaines étapes :</h3>
            <ul style="margin: 0; padding-left: 20px; color: #555; line-height: 1.8;">
              <li>Vous recevrez sous peu un lien pour rejoindre notre groupe WhatsApp/Telegram</li>
              <li>Un membre de l'équipe vous contactera pour une réunion d'intégration</li>
              <li>Vous serez informé des prochains événements et activités</li>
              <li>Vous pourrez participer à notre formation d'accueil des nouveaux bénévoles</li>
            </ul>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
            <p style="margin: 0 0 5px 0; color: #666; font-size: 13px;">
              💚 Ensemble, faisons la différence pour les jeunes camerounais !
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin: 0; color: #888; font-size: 14px;">
              Au plaisir de vous rencontrer très bientôt,<br/>
              <strong style="color: #333;">L'équipe Little Dream</strong>
            </p>
          </div>
        </div>
        
        <!-- Pied de page -->
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="margin: 0; color: #999; font-size: 12px;">
            📧 littledream.association@gmail.com | 📞 +237 640 420 079 / +237 673 356 881
          </p>
          <p style="margin: 15px 0 0 0; color: #bbb; font-size: 11px;">
            © ${currentYear} Little Dream Association - Tous droits réservés
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Génère un template HTML pour le rejet d'un bénévole
 */
const getVolunteerRejectedTemplate = (volunteerName, message = null) => {
  const currentYear = new Date().getFullYear();
  const defaultMessage = message || "Nous avons reçu de nombreuses candidatures et malheureusement nous ne pouvons pas donner suite à la vôtre pour le moment.";
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Little Dream - Suite de votre candidature</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        
        <div style="background: linear-gradient(135deg, #e63946 0%, #f4a261 100%); padding: 30px 20px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 10px;">📧✋</div>
          <h1 style="color: white; margin: 0; font-size: 24px;">Suite de votre candidature</h1>
        </div>
        
        <div style="padding: 35px 30px;">
          <p style="font-size: 16px; color: #333;">Bonjour <strong>${volunteerName}</strong>,</p>
          
          <p style="font-size: 15px; color: #555; line-height: 1.6; margin: 20px 0;">
            ${defaultMessage}
          </p>
          
          <p style="font-size: 15px; color: #555; line-height: 1.6;">
            Nous conservons votre candidature et vous invitons à postuler à nouveau ultérieurement ou à nous soutenir autrement (don, partage, bénévolat ponctuel).
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #888;">Cordialement,<br/><strong>L'équipe Little Dream</strong></p>
          </div>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <p style="color: #999; font-size: 12px;">© ${currentYear} Little Dream Association</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

//template confirmation de réception de don
const getDonationConfirmationTemplate = (donorName, amount, currency, paymentMethod, transactionId = null) => {
  const currentYear = new Date().getFullYear();
  const methodLabels = {
    orange: 'Orange Money',
    mtn: 'MTN Mobile Money',
    cash: 'Espèces'
  };
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Confirmation de don - Little Dream</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        
        <div style="background: linear-gradient(135deg, #e63946 0%, #f4a261 100%); padding: 30px 20px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 10px;">🙏✋</div>
          <h1 style="color: white; margin: 0; font-size: 24px;">Merci pour votre don !</h1>
        </div>
        
        <div style="padding: 35px 30px;">
          <p style="font-size: 16px; color: #333;">Bonjour <strong>${donorName}</strong>,</p>
          
          <p style="font-size: 15px; color: #555; line-height: 1.6;">
            Nous vous remercions chaleureusement pour votre généreux don de 
            <strong style="color: #e63946; font-size: 18px;">${parseFloat(amount).toLocaleString()} ${currency}</strong>.
          </p>
          
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #166534; margin: 0 0 10px 0;">📋 Détails de votre don</h3>
            <table style="width: 100%; color: #166534;">
              <tr><td style="padding: 5px 0;"><strong>Montant:</strong></td><td>${parseFloat(amount).toLocaleString()} ${currency}</td></tr>
              <tr><td style="padding: 5px 0;"><strong>Moyen de paiement:</strong></td><td>${methodLabels[paymentMethod] || paymentMethod}</td></tr>
              ${transactionId ? `<tr><td style="padding: 5px 0;"><strong>Transaction:</strong></td><td>${transactionId}</td></tr>` : ''}
              <tr><td style="padding: 5px 0;"><strong>Date:</strong></td><td>${new Date().toLocaleDateString('fr-FR')}</td></tr>
            </table>
          </div>
          
          <p style="font-size: 15px; color: #555; line-height: 1.6;">
            Votre soutien nous permet de poursuivre notre mission auprès des jeunes camerounais. 
            Grâce à vous, nous pouvons :
          </p>
          <ul style="color: #555; line-height: 1.8;">
            <li>📚 Financer des programmes éducatifs</li>
            <li>🍲 Offrir des repas aux enfants</li>
            <li>🎭 Organiser des activités culturelles</li>
            <li>🌱 Développer des projets durables</li>
          </ul>
          
         
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin: 0; color: #888; font-size: 14px;">
              Encore merci pour votre générosité,<br/>
              <strong style="color: #333;">L'équipe Little Dream</strong>
            </p>
          </div>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <p style="margin: 0; color: #999; font-size: 12px;">
            📧 littledream.association@gmail.com | 📞 +237 640 420 079 / +237 673 356 881
          </p>
          <p style="margin: 10px 0 0 0; color: #bbb; font-size: 11px;">
            © ${currentYear} Little Dream Association
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Template email pour notification admin de nouveau don
 */
const getAdminDonationNotificationTemplate = (donation) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Nouveau don - Little Dream</title>
    </head>
    <body style="font-family: Arial, sans-serif;">
      <h2>📢 Nouveau don reçu !</h2>
      <table style="border-collapse: collapse;">
        <tr><td style="padding: 8px;"><strong>Donateur:</strong></td><td style="padding: 8px;">${donation.donor_name || 'Anonyme'}</td></tr>
        <tr><td style="padding: 8px;"><strong>Email:</strong></td><td style="padding: 8px;">${donation.donor_email || 'Non renseigné'}</td></tr>
        <tr><td style="padding: 8px;"><strong>Montant:</strong></td><td style="padding: 8px;">${donation.amount} ${donation.currency}</td></tr>
        <tr><td style="padding: 8px;"><strong>Moyen:</strong></td><td style="padding: 8px;">${donation.payment_method}</td></tr>
        <tr><td style="padding: 8px;"><strong>Téléphone:</strong></td><td style="padding: 8px;">${donation.phone_number || '-'}</td></tr>
        ${donation.message ? `<tr><td style="padding: 8px;"><strong>Message:</strong></td><td style="padding: 8px;">${donation.message}</td></tr>` : ''}
      </table>
      <p><a href="${process.env.CLIENT_URL}/admin/dons">Voir dans l'admin</a></p>
    </body>
    </html>
  `;
};


module.exports = { 
  sendEmail, 
  getVolunteerAcceptedTemplate,  
  getVolunteerRejectedTemplate,
  getAdminDonationNotificationTemplate,
  getDonationConfirmationTemplate,
};