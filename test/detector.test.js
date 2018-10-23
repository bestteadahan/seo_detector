const assert = require('assert')
const Detector = require('../lib/seoDetector.js')
const rules = require('../lib/rules_config')
const detector = new Detector(rules)

describe('Detector object test', () => {
    it('Constructor check', () => {
        assert.equal(detector.rules, rules)
        assert.equal(detector.getAttributeRule(), rules)
    })
    // it('')
})