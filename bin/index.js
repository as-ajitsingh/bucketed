#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');

const Bucketed = require('../lib/Bucketed');

const packageJson = require('../package.json');

const log = {
    info: (msg) => console.log(chalk.bold.green(msg) + "\n"),
    error: (msg) => console.log(chalk.bold.red(msg) + "\n"),
    warn: (msg) => console.log(chalk.keyword('orange')(msg) + "\n")
};

program.version(`${packageJson.name}: v${packageJson.version}`, '-v, --version')
    .description(packageJson.description);

program
    .command('deploy')
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

function deploy() {
    try {
        let bucketed = new Bucketed();
        bucketed.deploy().then(result => log.info(JSON.stringify(result)));
    } catch (error) {
        log.error(error);
    }

}