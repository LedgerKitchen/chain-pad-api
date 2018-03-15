require('dotenv').load();

let UserMongo = require('./modules/repo/userRepository');

let data = {
    name: 'Admin',
    lastName: 'Adminov',
    email: 'admin@chain-pad.com',
    phone: '79999999999',
    networkCard: process.env.CARD,
    role: 'ADMIN'
};

/* Create admin user */
(async function createAdmin(data) {
    await UserMongo.createUserMongo(data).then(() => {
        console.log('Admin user successfully created');
        process.exit(1);
    }).catch(er => {
        if (er.toJSON().code === 11000) {
            console.error("Admin already exist")
        } else {
            console.log(er.toJSON().message);
        }
        process.exit(1);
    });
})(data);