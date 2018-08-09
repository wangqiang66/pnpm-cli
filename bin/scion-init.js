#!/usr/bin/env node

const program = require("commander");
const download = require('download-git-repo');
// const rm = require("rimraf").sync;
const exist = require("fs").existsSync;
const path = require("path");
const inquirer = require("inquirer");
const home = require('user-home');
const logger = require("../lib/logger");
// const checkVersion = require("../lib/check-version");
const generate = require('../lib/generate');
const ora = require("ora");

program.usage('[option] <project-name>')
    .option('-t, --test', 'Add unit test for components')
    .parse(process.argv);

const test = program.test || false;
const rawName = program.args.length >= 2 ? program.args[1] : program.args.length === 1 && !program.test ? program.args[0] : "";
const inPlace = !rawName || rawName === '.';
const name = inPlace ? path.relative('../', process.cwd()) : rawName;
const to = path.resolve(name, '.');
const tmp = path.join(home, '.vue-templates', 'npm-publish')

process.on('exit', () => {
    console.log("exit");
})



if (exist(to)) {
    inquirer.prompt([{
        type: 'confirm',
        message: "Exist Same project name in current project, Continue?",
        name: 'ok'
    }]).then(answers => {
        if(answers.ok) {
            run();
        }
    }).catch(logger.fatal)
} else {
    run();
}

function run() {
    // checkVersion(() => {
        downloadAndGenerate("wangqiang66/npm-cli");
    // });
}

function downloadAndGenerate (template) {
    const spinner = ora("downloading template");
    spinner.start();
    download(template, tmp, {clone: false}, err => {
        if (err) {
            logger.fatal("download template [" + template + "] error ", err);
        }
        // logger.success('Generated "%s".', name);
        generate(name, tmp, to, err => {
            if (err) {
                logger.fatal(err);
            } else {
                console.log()
                logger.success('Generated "%s".', name)
            }
        }, {test})
    })
}


