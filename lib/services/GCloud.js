const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

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
        let fileList = await this[_getAllFileListFromDist]();
        let commonUploadOptions = {
            gzip: true
        };
        for (let filePath of fileList) {
            await this.storage.bucket(this.bucket).upload(path.resolve(filePath), { ...commonUploadOptions, destination: filePath.split(this.distDir)[1] });
            console.log(`${filePath.split(this.distDir)[1]} uploaded successfully.`)
        }

        return Promise.resolve(`All files uploaded.`);
    }

    async publicAll() {
        let fileList = await this[_getAllFileListFromDist]();
        for (let filePath of fileList) {
            await this.storage.bucket(this.bucket).file(filePath.split(this.distDir)[1]).makePublic();
            console.log(`${filePath.split(this.distDir)[1]} made public successfully.`)
        }

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