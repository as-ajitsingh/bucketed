#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const yaml = require('yaml');
const fs = require('fs');
const path = require('path');

const Bucketed = require('../lib/Bucketed');
const queries = require('./utilities/queries');

const packageJson = require('../package.json');

const log = {
    info: (msg) => console.log(chalk.bold.green(msg) + "\n"),
    error: (msg) => console.log(chalk.bold.red(msg) + "\n"),
    warn: (msg) => console.log(chalk.keyword('orange')(msg) + "\n")
};

program.version(`${packageJson.name}: v${packageJson.version}`, '-v, --version')
    .description(packageJson.description);

program
    .command('init')
    .option('-c, --config [location]', 'specify the location and name of bucketed config file', '.bucketed')
    .alias('i')
    .description('Initialize bucketed project and create bucketed config file')
    .action(init);

program
    .command('deploy')
    .option('-c, --config [location]', 'specify the location and name of bucketed config file', '.bucketed')
    .alias('d')
    .description('Deploy your static site content to specified bucket.')
    .action(deploy);

// Assert that a VALID command is provided 
if (!process.argv.slice(2).length) {
    log.error("Error ! No command specified. Please have a look at help section")
    program.outputHelp();
    process.exit();
}

program.parse(process.argv);

function init({ config }) {
    try {
        queries.init().then(initQueryResult => {
            let configContent = {
                version: packageJson.version,
                project: {
                    name: initQueryResult.projectName,
                    distDir: initQueryResult.distDir
                },
                vendor: {
                    type: initQueryResult.vendorType,
                    // projectID: initQueryResult.projectID, // changing for google cloud #1
                    keyLocation: initQueryResult.keyLocation,
                    bucketName: initQueryResult.bucketName
                }
            };
            // only add if the project id is returned from prompt            
            if (initQueryResult.projectID) configContent.vendor['projectID'] = initQueryResult.projectID;

            let bucketedConfigFileLocation = path.resolve(config);
            if (fs.existsSync(bucketedConfigFileLocation)) throw new Error('Bucketed Configuration file already exist.');
            fs.writeFileSync(bucketedConfigFileLocation, yaml.stringify(configContent));
        }).catch(catchErrors);
    } catch (error) {
        catchErrors(error);
    }
}

function deploy({ config }) {
    try {
        let bucketed = new Bucketed(config);
        bucketed.deploy().then(result => log.info(result)).catch(catchErrors);
    } catch (error) {
        catchErrors(error);
    }

}

function catchErrors(error) {
    log.error('\n' + error);
    process.exit(1);
}