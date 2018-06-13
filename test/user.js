require('dotenv').load();

const UserMongoRepo = require('../modules/repo/userRepository');
const UserMongo = require('../modules/models/userModel');
let rnd = Math.floor(Math.random(1, 1000) * 1000);
let data = {
    name: 'Test',
    lastName: 'Test',
    email: rnd + 'test@chainpad-network.com',
    phone: rnd + '70009999999',
    networkCard: rnd + 'test@chainpad-network.com',
};

function arrayUnique(array) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
}

/* CREATE USER */

async function createUser(data) {
    return await UserMongoRepo.createUserMongo(data)
        .then((user) => {
            console.log(user);
            console.log('User was created');
            return user;
        })
}

async function setDevice(user, device) {
    return await UserMongo.findOne({userId: user.userId})
        .then(user => {
            user.set({device: arrayUnique(user.device.concat([device]))});
            console.log('Updated');
            return user.save();
        })
}

async function deleteUser(user) {
    console.log(user);
    return await UserMongo.findOne({userId: user.userId})
        .then(user => {
            console.log(user);
            console.log(user.device);
            console.log(typeof user.device);
            console.log('Deleted');
            return user.remove();
        })
}

createUser(data)
    .then(u => setDevice(u, "device 1"))
    .then(u => setDevice(u, "device 1"))
    .then(u => setDevice(u, "device 1"))
    .then(u => setDevice(u, "device 1"))
    .then(u => setDevice(u, "device 1"))
    .then(u => setDevice(u, "device 2"))
    .then(u => setDevice(u, "device 2"))
    .then(u => setDevice(u, "device 2"))
    .then(u => setDevice(u, "device 3"))
    .then(u => setDevice(u, "device 3"))
    .then(u => setDevice(u, "device 5"))
    .then(u => setDevice(u, "device 12"))
    .then(u => setDevice(u, "device 12"))
    .then(u => setDevice(u, "device 12"))
    .then(u => setDevice(u, "device 12"))
    .then(deleteUser)
    .then(() => process.exit(1))
    .catch(error => {
        try {
            if (error.toJSON().code === 11000) {
                console.error("User already exist")
            } else {
                console.log(error.toJSON().message);
            }
        } catch (e) {
            console.error(error);
            console.error(e);
        }
        process.exit(1);
    });