const path = require('path');
const yaml = require('yaml');
const fs = require('fs');

class Bucketed {
    constructor() {
        this.projectPath = path.resolve(process.cwd());
        if (!fs.existsSync(path.join(this.projectPath, '.bucketed'))) throw new Error('Bucketed Configuration file missing.');
        this.configFile = fs.readFileSync(path.join(this.projectPath, '.bucketed'), 'utf8');
        this.config = yaml.parse(this.configFile);
    }

    deploy() {
       switch(this.config.vendor.type){
       }
       
    }
}


module.exports = Bucketed;