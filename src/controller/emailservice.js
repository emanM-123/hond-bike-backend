const nodemailer = require('nodemailer');
const fs = require('fs');
const util = require('util');
const path = require('path');
const { google } = require('googleapis');
const credentials = require('../../cridentials.json'); 

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const readFile = util.promisify(fs.readFile);

async function getTemplate(templateName) {
    const templatePath = path.join(__dirname, `../templates/${templateName}.html`);
    return await readFile(templatePath, 'utf8');
}

const sendEmail = async (req, res) => {
    try {
        const { templateType, to, ...templateData } = req.body;

        console.log(templateData);
        
        templateData.renewInsuranceChecked = templateData.renewInsuranceChecked ? 'Yes' : 'No';
        templateData.extendedWarrantyChecked = templateData.extendedWarrantyChecked ? 'Yes' : 'No';

        const row = [
            templateData.name || '',
            templateData.phone || templateData.phone || '',
            templateData.email || '',
            templateData.branch || '',
            templateData.selectedModel || '', 
            templateData.subject || '',
            templateData.message || '',
            templateData.renewInsuranceChecked || '',
            templateData.extendedWarrantyChecked || '',
            templateData.forTestRide || 'No',
            templateData.forEnquiry || 'No'
        ];
        const sheets = google.sheets({ version: 'v4', auth });
        await sheets.spreadsheets.values.append({
            auth,
            spreadsheetId: '1p4mI_KBwyFm-xwGGO0IMJFMUTKiz-Vq_gy6QePMXydY',
            range: 'Sheet1!A1',                     
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [row]
            },
        });
        console.log('Form data stored successfully in Google Sheets');

        const emailTemplate = await getTemplate(templateType);
        let html = emailTemplate;
        Object.keys(templateData).forEach(key => {
            html = html.replace(new RegExp(`{{${key}}}`, 'g'), templateData[key]);
        });
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        
        let mailOptions = {
            from: `"Honda Bike Zone" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: templateData.emailSubject,
            html: html,
        };

        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        res.send('Email sent successfully');
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send('Error sending email');
    }
}

module.exports = { sendEmail };
