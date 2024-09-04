const router = require('express').Router();
const { sendEmail } = require('../controller/emailservice.js');
const { sendSms } = require('../controller/smsService.js');

router.post('/send-email', sendEmail);
router.post('/send-sms', sendSms);

module.exports = router;
