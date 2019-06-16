const AWSClient = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const ProgressBar = require('cli-progress');
const colors = require('colors');
var mimeType = require('mime-types')
const logger = require('../utilities/logger');


const _getAllFileListFromDist = Symbol('getAllFileListFromDist');
const _uploadToS3 = Symbol('uploadToS3');

class AWS {
    constructor(keyLocation, bucket, distDir) {
        this.keyLocation = keyLocation;
        this.bucket = bucket;
        this.distDir = distDir;
        this.storage = new AWSClient.S3();
        this.storage.config.loadFromPath(this.keyLocation);
    }

    getAllFilesFromBucket() {
        return new Promise((resolve, reject) => {
            let parameters = {
                Bucket: this.bucket
            };
            this.storage.listObjects(parameters, (error, data) => {
                if (error) reject(error);
                else resolve(data);
            });
        });
    }

    async uploadAll() {

        logger.info("Getting list of all files...");
        let fileList = await this[_getAllFileListFromDist]();
        logger.info(`Total ${fileList.length} files found.`);

        //creating progress bar for all files.
        var bar = new ProgressBar.Bar(
            { format: `${colors.green('Uploading files')} [ ${colors.green('{bar}')} ] {percentage}% | ETA: {eta}s` },
            ProgressBar.Presets.rect
        );

        //defining progress bar 
        var barState = 0;
        bar.start(200, barState);

        for (let filePath of fileList) {
            await this[_uploadToS3](filePath);
            barState += 200 / fileList.length;
            bar.update(barState)
        }
        bar.stop();
        return Promise.resolve(`All files uploaded.`);
    }

    [_uploadToS3](filePath) {
        return new Promise((resolve, reject) => {
            let parameters = {
                Bucket: this.bucket,
                Key: filePath.split(this.distDir + '/')[1],
                Body: fs.readFileSync(filePath),
                ContentType: mimeType.lookup(path.basename(filePath)) || 'application/octet-stream'
            };
            this.storage.upload(parameters, (error, data) => {
                if (error) reject(error);
                else resolve(data);
            });
        });
    }

    [_getAllFileListFromDist]() {
        return new Promise((resolve, reject) => {
            glob(this.distDir + '/**/*.*', (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    }

}

module.exports = AWS;