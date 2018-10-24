const assert = require('assert')
const Detector = require('../lib/seoDetector.js')
const rules = require('../lib/rules_config')

const detector = new Detector(rules)

describe('Detector object funtional tests', () => {

    describe('Public function test', () => {
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

        it('#detector(document)', done => {
            let testFile = 'test.html'
            detector.readFromFile(testFile)
                .then(res => {
                    assert.equal(detector.detect(res),undefined)
                    done()
                })
        })

    })
})