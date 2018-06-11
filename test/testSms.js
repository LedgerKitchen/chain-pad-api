require('dotenv').load();

let sms = require('../modules/repo/smsCodeRepository');
return sms.send('79819469906', Math.random()).then(r => {
    console.log(r);
});


