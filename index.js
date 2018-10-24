#!/usr/bin/env node
'use strict'

const program = require('commander')
const isUrl = require('is-url')
const fs = require('fs')
const path = require('path')
const seoDetector = require('./lib/seoDetector.js')

const list = (val) => val.split(',')

program
    .version('0.0.1')
    .arguments('<input> [file ...]', 'The file path or url.')
    .option('-f, --file [name]', 'The input file (ex: demo.html)', list)
    .option('-u, --url [name]', 'The url source (ex: www.demo.com)', list)
    .option('-o, --output [name]', 'The output result file (ex: result.txt)')
    .option('-r, --rules <no.>', 'The number of rule that applied to detector.If many, seperate by ","', list)
    .parse(process.argv);

// Detect rules
let rules = require('./lib/rules_config')
// Apply customized rules
if (program.rules) {
    rules = rules.filter(rule => program.rules.includes(rule.no))
}

// output
if (program.output) {
    let output = program.output
    console.log(`output: ./logs/${output} \n error: ./logs/error-${output}`)
    let logfile = fs.createWriteStream(`logs/${output}`)
    let errfile = fs.createWriteStream(`logs/error-${output}`)
    process.stdout.write = logfile.write.bind(logfile);
    process.stderr.write = errfile.write.bind(errfile);
}

// Create new detector
let detector = new seoDetector(rules)
console.log('< rules_config >\n', JSON.stringify(detector.getAttributeRule(), null, 2))

// Input: file or url
function readSource(type) {
    let choose = {
        file: detector.readFromFile,
        url: detector.readFromStream
    }
    return function (input) {
        choose[type](input)
            .then(document => {
                console.log(`\n#### Detect source: ${input} ####`)
                detector.detect(document)
            })
            .catch(err => console.log(err))
    }
}

if (program.file) {
    let files = program.file
    files.forEach(file => {
        if (fs.existsSync(file) && (path.extname(file) == '.html')) {
            readSource('file')(file)
        } else {
            console.error(`Invalid file: ${file}`)
        }
    })
}

if (program.url) {
    let urls = program.url
    urls.forEach(url => {
        if (isUrl(url)) {
            readSource('url')(url)
        } else {
            console.error(`Invalid url: ${url}`)
        }
    })
}
// tea -f demo.html -u https://www.google.com -o res.txt -r 1,2,3