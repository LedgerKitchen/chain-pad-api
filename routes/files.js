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

router.all('/get/:padId/:hash', function (req, res, next) {
    return IPFS.get(req.params.hash).then(file => {
        let ft = fileType(file);
        let result = {};

        if (ft !== null)
            result = {
                success: true,
                contentType: mime.lookup(ft.ext),
                fileExtension: ft.ext,
                file: file,
                id: req.params.hash
            };
        else
            result = {success: false, message: "File can not be read"};

        return res.send(result);
    }).catch(_ => {

        res.send({success: false, message: "File can not be read"});
    })
});

router.post('/delete/:padId/:hash', function (req, res, next) {

    return IPFS.delete(req.params.hash, req.body.name).then(() => {

        return req.LedgerConnector.init(req.user.networkCard).then(Ledger => {
            return Ledger.Pad.deleteFile({
                padId: req.params.padId,
                fileDeleteHash: req.params.hash
            }).then(() => {
                return res.send({success: true, message: 'file delete'});
            })

        })

    }).catch(error => {
        console.log(error);
        res.send({success: false, message: "File can not be delete"});
    })
});


module.exports = router;