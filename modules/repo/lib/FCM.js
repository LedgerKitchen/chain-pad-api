const gcm = require('node-gcm');

module.exports = {
    sendMessage: function (devices, arData, callback) {
        let sender = new gcm.Sender(process.env.FCM_API_KEY),
            msgParams = {
                priority: 'high',
                delayWhileIdle: true,
                timeToLive: 3,
                data: arData.data || {},

            };

        if (arData.notification) {
            msgParams = Object.assign(msgParams, {
                notification: {
                    title: arData.notification.title,
                    body: arData.notification.text
                }
            })
        }

        let message = new gcm.Message(msgParams);


        sender.send(message, {registrationTokens: devices}, async function (err, response) {
            let result = {};
            if (err) result = Object.assign(result, {success: false, error: err.toString()});
            else result = Object.assign(result, {success: response.success > 0, fcmData: response});

            if (typeof callback === 'function') {
                callback(result);
            } else console.error(result);

        });
    }
};