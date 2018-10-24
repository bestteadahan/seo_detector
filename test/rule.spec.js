const assert = require('assert')
const fs = require('fs')
const path = require('path')

describe('Rule\'s spec', () => {
    var rules

    it('Must be an available file named "myrules.json"', () => {
        assert.doesNotThrow(() => {
            rules = JSON.parse(fs.readFileSync(path.resolve('myrules.json')))
        }, Error)
    })

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
        rules.forEach(rule => {
            assert.ok(typeof (rule.conditions) === 'object')
            assert.ok(Array.isArray(rule.conditions))
            assert.ok(rule.conditions.length >= 1)
        })
    })

    it('Check each condition in rule.conditions ', () => {
        rules.forEach(rule => {
            rule.conditions.forEach(condition => {
                assert.ok(condition['tag'])
                if ('val' in condition) {
                    assert.ok(condition.hasOwnProperty('attr'))
                }
                if ('length' in condition) {
                    assert.ok(typeof (condition['length']) === 'number')
                }
            })
        })
    })
})