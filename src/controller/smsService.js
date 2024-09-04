const { Twilio } = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = new Twilio(accountSid, authToken);

const sendSms = async (req, res) => {
   console.log(req.body);
   
    let { phone } = req.body;

    if (!phone) {
        return res.status(400).send({ error: 'Phone number is required' });
    }    

    if (!phone.startsWith('+91')) {
        phone = `+91${phone}`;
    }
console.log(phone, twilioPhoneNumber);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const messageBody = `Your OTP code is: ${otp}`;
    try {
        await client.messages.create({
            body: messageBody,
            from: twilioPhoneNumber,
            to: phone
        });
        res.status(200).send({ message: 'OTP sent successfully', otp: otp });

    } catch (error) {    
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    sendSms
};
