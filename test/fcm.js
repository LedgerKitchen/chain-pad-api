require('dotenv').load();

let fcm = require('../modules/repo/lib/FCM');
let dId = [
    "f45U_1AekMQ:APA91bFO2xtuaM2pTGVJQYvJXfCee8qVleK-oqRqYVxT7uP3pDmNGMCFnMvSHE7BaEufVL4lpxrg5DetYc_HnRre6n9Pofelf3gijVpgs1R5LiU5SFeHPjCCtv8LbB2dfH1g98akvrXd"
];

return fcm.sendMessage(dId, {text: 'Test message'},function (result) {
    console.log(result);
});

