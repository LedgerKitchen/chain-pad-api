let ipfsAPI = require('ipfs-api');
let fs = require('fs');
let chainCrypto = require('../chainCrypto');
const fileType = require('file-type');
const mime = require('mime-types');

class IpfsFile {

    constructor(ipfsAddress) {
        this.ipfsConnect = ipfsAPI(ipfsAddress);
    }

    add(arFiles = {}, deleteLocalFilesAfterUpload = false) {
        let files = [],
            tmpFiles = [],
            content,
            ft;

        for (let i in arFiles) {

            content = fs.readFileSync(arFiles[i].path);
            ft = fileType(content);

            tmpFiles[arFiles[i].originalname] = {
                name: arFiles[i].originalname,
                mime: mime.lookup(ft.ext),
                extension: ft.ext,
                cryptoAlgorithm: process.env.CHAINPAD_CRYPTO_ALGHORITM,
                crc: chainCrypto.crc(content)
            };
            files.push({content: chainCrypto.encryptBuffer(content), path: arFiles[i].originalname});
        }


        return Promise.all(files.map(file => {
            return this.ipfsConnect.files.add(file);
        })).then(ipfsFiles => {

            if (deleteLocalFilesAfterUpload) {
                for (let i in arFiles) {
                    fs.unlink(arFiles[i].path, error => {
                        if (error) {
                            console.error(error);
                        }
                    });
                }
            }

            let date = new Date();

            return ipfsFiles.map(function (file, index, array) {
                file = file[0];
                if (tmpFiles[file.path]) {
                    return Object.assign({
                        hash: file.hash,
                        size: file.size,
                        pathIPFS: file.path,
                        dateCreate: date,
                        dateCreateTimestamp: date.getTime()
                    }, tmpFiles[file.path])
                }
            }).filter(file => {
                return typeof file !== 'undefined';
            });
        });
    }

    get(fileHash = null) {
        return this.ipfsConnect.files.get(fileHash).then((f) => {
            return chainCrypto.decryptBuffer(f[0].content);
        });
    }

    delete(fileHash = null, fileName = null) {
        return this.ipfsConnect.pin.rm(fileHash).then((files) => {
            return this.ipfsConnect.repo.gc({options: 'quiet'});
        }).catch(err => console.log(err));
    }
}


module.exports = IpfsFile;