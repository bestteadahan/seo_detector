#!/usr/bin/env node
'use strict'

const program = require('commander')
const isUrl = require('is-url')
const fs = require('fs')
const path = require('path')
const seoDetector = require('./lib/seoDetector.js')

const list = (val) => val.split(',')

program
    .version('1.0.1')
    .option('-f, --file [name|path]', 'The input file path(ex: demo.html)', list)
    .option('-u, --url [addr]', 'The url source (ex: http://www.demo.com)', list)
    .option('-o, --output [name]', 'The output file name (ex: result.txt)')
    .option('-c, --conf', 'Using custom rules: myrules.json')
    .option('-r, --rules [no,...]', 'The number of rule that applied to detector, seperate by ","', list)
    .parse(process.argv)

// Use custom rule config
let rules
if (program.conf && fs.existsSync('myrules.json')) {
    console.log('Using customized rules...')
    let myrules = fs.readFileSync('myrules.json', { encoding: 'utf8' })
    if (!myrules) {
        console.error('Invalid JSON format')
        process.exit()
    } else {
        rules = JSON.parse(myrules)
    }
} else {
    console.log('Using default rules...')
    rules = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'lib/seorule_conf_default.json')))
}

// Apply specific rule numbers
if (program.rules) {
    rules = rules.filter(rule => program.rules.includes(rule.no))
    console.log('[ Rule List ]\n', JSON.stringify(rules, null, 2))
}

// output
if (program.output) {
    let output = program.output
    console.log(`output: ${output} \n error: error-${output}`)
    let logfile = fs.createWriteStream(`${output}`)
    let errfile = fs.createWriteStream(`${output}.error`)
    process.stdout.write = logfile.write.bind(logfile);
    process.stderr.write = errfile.write.bind(errfile);
}

// Create new detector
let detector = new seoDetector(rules)
// console.log('< rules_config >\n', JSON.stringify(detector.getAttributeRule(), null, 2))

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
            .catch(err => {
                let msg = { 'input': input, 'error': err }
                console.error(JSON.stringify(msg, null, 2))
            })
    }
}

if (program.file && (program.file.length >= 1)) {
    let files = program.file
    files.forEach(file => {
        if (fs.existsSync(file) && (path.extname(file) == '.html')) {
            readSource('file')(file)
        } else {
            console.error(`Invalid file: ${file}`)
        }
    })
} else {
    console.log('No file inputs')
}

if (program.url && (program.url.length >= 1)) {
    let urls = program.url
    urls.forEach(url => {
        if (isUrl(url)) {
            readSource('url')(url)
        } else {
            console.error(`Invalid url: ${url}`)
        }
    })
} else {
    console.log('No url inputs')
}