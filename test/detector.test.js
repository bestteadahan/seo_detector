const assert = require('assert')
const htmlParser = require('node-html-parser')
const Detector = require('../lib/seoDetector.js')
const fs = require('fs')
const rules = JSON.parse(fs.readFileSync('lib/seorule_conf_default.json'))

const detector = new Detector(rules)

describe('Detector object funtional tests', () => {

    describe('Public function test (use default rules)', () => {
        it('#getAttributeRule()', () => {
            assert.equal(detector.getAttributeRule(), rules)
        })

        it('#readFromFile(file)', done => {
            let testFile = 'test.html'
            detector.readFromFile(testFile)
                .then(res => {
                    assert.ok(res)
                    done()
                })
        })

        it('#readFromStream(url)', done => {
            let testUrl = 'https://www.google.com/'
            detector.readFromStream(testUrl)
                .then(res => {
                    assert.ok(res)
                    done()
                })
        })

        it('#detector(document)', () => {
            let fakeDom = htmlParser.parse('<html></html>')
            assert.ifError(detector.detect(fakeDom))
        })
    })
})