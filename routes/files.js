let express = require('express');
const router = express.Router();
let CPUtils = require("../modules/CPUtils");
let log = require("../modules/CPLogger");
let IPFSRepository = require('../modules/repo/IPFSRepository');
const IPFS = new IPFSRepository(process.env.IPFS_URL);
let fileType = require('file-type');
let mime = require('mime-types');

/************** Authenticate users **************/

router.all('/get', function (req, res, next) {
    return req.CPCache.store('ipfs-file-' + req.body.hash, () => IPFS.get(req.body.hash)).then(file => {
        let ft = fileType(file) || {ext: 'text/plain'};
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
    return req.CPCache.store('ipfs-file-' + hash, () => IPFS.get(hash)).then(file => {
        let ft = fileType(file) || {ext: 'text/plain'};
        res.header("Content-Type", mime.lookup(ft.ext));
        res.send(new Buffer(file));
    }).catch(_ => {
        res.send({success: false, message: "File cannot be read"});
    })
});

router.post('/delete', function (req, res, next) {

    return IPFS.delete(req.body.hash, req.body.name).then(() => {

        return req.CPLedger.init(req.user.networkCard).then(Ledger => {
            return Ledger.Pad.deleteFile({
                padId: req.body.padId,
                fileDeleteHash: req.body.hash
            }).then(() => {
                req.CPCache.delete('ipfs-file-' + req.body.hash);
                return res.send({success: true});
            })

        })

    }).catch(error => {
        res.send({success: false, message: error.toString()});
    })
});


module.exports = router;