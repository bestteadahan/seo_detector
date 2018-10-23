const assert = require('assert')
const rules = require('../lib/rules_config')

describe('Rule\'s spec', () => {

    it('Rules in rules_config.js should be a non-empty array', () => {
        assert.equal(typeof (rules), 'object')
        assert.ok(Array.isArray(rules))
        assert.ok(rules.length >= 1)
    })

    it('Should has 3 keys with value: no, region, conditions.', () => {
        let keys = ['no', 'region', 'conditions']
        rules.forEach(rule => {
            assert.equal(typeof (rule), 'object')
            assert.ok(keys.every(key => (key in rule) && rule[key]))
        })
    })

    it('Conditions in each rule should be a non-empty array', () => {
        assert.ok(rules.every(rule => typeof (rule.conditions) === 'object'))
        assert.ok(rules.every(rule => Array.isArray(rule.conditions)))
        assert.ok(rules.every(rule => rule.conditions.length >= 1))
    })

    it('Conditions ', () => {
        assert.ok(rules.every(rule => typeof (rule.conditions) === 'object'))
        assert.ok(rules.every(rule => Array.isArray(rule.conditions)))
        assert.ok(rules.every(rule => rule.conditions.length >= 1))
    })
})