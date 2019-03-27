const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const ProgressBar = require('cli-progress');
const colors = require('colors');
const logger = require('../utilities/logger');

const _getAllFileListFromDist = Symbol('getAllFileListFromDist');

class GCloud {
    constructor(projectId, keyLocation, bucket, distDir) {
        this.projectId = projectId;
        this.keyLocation = keyLocation;
        this.bucket = bucket;
        this.distDir = distDir;

        this.storage = new Storage({
            projectId: this.projectId,
            keyFile: this.keyLocation
        });
    }

    async getAllFilesFromBucket() {
        return await this.storage.bucket(this.bucket).getFiles();
    }

    async uploadAll() {
        logger.info("Calculating total number of files...");
        let fileList = await this[_getAllFileListFromDist]();
        logger.info(`Total ${fileList.length} files found.`);
        let commonUploadOptions = {
            gzip: true
        };

        //creating progress bar for all files.
        var bar = new ProgressBar.Bar(
            { format: `${colors.green('Uploading files')} [ ${colors.green('{bar}')} ] {percentage}% | ETA: {eta}s` },
            ProgressBar.Presets.rect
        );

        //defining progress bar 
        var barState = 0;
        bar.start(200, barState);

        for (let filePath of fileList) {
            await this.storage.bucket(this.bucket).upload(path.resolve(filePath), { ...commonUploadOptions, destination: filePath.split(this.distDir)[1] });
            barState += 200 / fileList.length;
            bar.update(barState)
        }
        bar.stop();
        return Promise.resolve(`All files uploaded.`);
    }

    async publicAll() {
        let fileList = await this[_getAllFileListFromDist]();

        //creating progress bar for all files.
        var bar = new ProgressBar.Bar(
            { format: `${colors.green('Publishing files')} [ ${colors.green('{bar}')} ] {percentage}% | ETA: {eta}s` },
            ProgressBar.Presets.rect
        );

        //defining progress bar 
        var barState = 0;
        bar.start(200, barState);

        for (let filePath of fileList) {
            await this.storage.bucket(this.bucket).file(filePath.split(this.distDir)[1]).makePublic();
            barState += 200 / fileList.length;
            bar.update(barState)
        }

        bar.stop();
        return Promise.resolve(`All files uploaded.`);
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

module.exports = GCloud;