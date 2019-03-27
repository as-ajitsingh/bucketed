const path = require('path');
const yaml = require('yaml');
const fs = require('fs');

const GCloud = require('./services/GCloud');

const _gcloudHandler = Symbol('gcloudHandler');

class Bucketed {
    constructor(configFile = '.bucketed') {
        this.projectPath = path.resolve(process.cwd());
        if (!fs.existsSync(path.join(this.projectPath, configFile))) throw new Error('Bucketed Configuration file missing.');
        this.configFile = fs.readFileSync(path.join(this.projectPath, configFile), 'utf8');
        this.config = yaml.parse(this.configFile);
    }

    deploy() {
        switch (this.config.vendor.type) {
            case 'gcloud': return this[_gcloudHandler](this.config); break;
            default: throw new Error("Unknown provider");
        }

    }

    async [_gcloudHandler](config) {
        let gcloud = new GCloud(config.vendor.projectID, config.vendor.keyLocation, config.vendor.bucketName, config.project.distDir);
        await gcloud.uploadAll();
        await gcloud.publicAll();
        return Promise.resolve("Completed Successfully.");
    }
}


module.exports = Bucketed;