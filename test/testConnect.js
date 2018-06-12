require('dotenv').load();
const cp = new (require("../modules/CPLedger"));
console.debug('Card set .env as ' + process.env.CARD);
cp.init(process.env.CARD).then(() => {
    cp.close();
    setTimeout(function () {
        console.debug('Network is working.');
        process.exit(1);
    }, 3000);
});
