let express = require('express');
const router = express.Router();
let rUtils = require("../modules/rUtils");
let JWT = require("../modules/jwt");
let log = require("../modules/logger");
let IPFSRepository = require('../modules/repo/IPFSRepository');
const IPFS = new IPFSRepository(process.env.IPFS_URL);
const fileType = require('file-type');
const mime = require('mime-types');
let fs = require('fs');
/************** Authenticate users **************/

router.all('/get', function (req, res, next) {
    return IPFS.get(req.body.hash).then(file => {
        let ft = fileType(file) || {ext:'text/plain'};
        let result = {};

        if (ft !== null)
            result = {
                success: true,
                contentType: mime.lookup(ft.ext),
                fileExtension: ft.ext,
                file: file.toString('base64'),
                hash: req.body.hash
            };
        else
            result = {success: false, message: "File cannot be read"};

        return res.send(result);
    }).catch(_ => {

        res.send({success: false, message: "File cannot be read"});
    })
});

router.all('/getFile', function (req, res, next) {
    let hash = req.query.hash || req.body.hash;
    return IPFS.get(hash).then(file => {
        let ft = fileType(file) || {ext:'text/plain'};
        res.header("Content-Type", mime.lookup(ft.ext));
        res.send(new Buffer(file));
    }).catch(_ => {
        res.send({success: false, message: "File cannot be read"});
    })
});

router.post('/delete', function (req, res, next) {

    return IPFS.delete(req.body.hash, req.body.name).then(() => {

        return req.LedgerConnector.init(req.user.networkCard).then(Ledger => {
            return Ledger.Pad.deleteFile({
                padId: req.body.padId,
                fileDeleteHash: req.body.hash
            }).then(() => {
                return res.send({success: true});
            })

        })

    }).catch(error => {
        res.send({success: false, message: error.toString()});
    })
});


module.exports = router;