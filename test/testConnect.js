require('dotenv').load();

let UserMongo = require('../modules/repo/userRepository');
const HLF = require("../modules/connect-to-network");

//process.env.CARD

return HLF.network(process.env.CARD);