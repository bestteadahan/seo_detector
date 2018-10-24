const htmlParser = require('node-html-parser')
const fs = require('fs')
const axios = require('axios')

module.exports = function seoDetector(rules) {
    var rules = rules
    this.getAttributeRule = () => {
        return rules
    }
    this.readFromFile = async (file) => {
        let content = fs.readFileSync(file, 'utf8')
        let document = htmlParser.parse(content)
        return Promise.resolve(document)
    }
    this.readFromStream = async (url) => {
        return new Promise((resolve, reject) => {
            axios.get(url)
                .then(res => {
                    let document = htmlParser.parse(res.data.replace(/\'/g, '\"'))
                    resolve(document)
                })
                .catch(err => {
                    reject(err.errno)
                })
        })
    }
    this.detect = (document) => {
        if (!document | (document.constructor.name != 'HTMLElement')) {
            console.error('Empty document!')
        } else {
            rules.forEach(rule => {
                console.log(`[Rule no.${rule.no}]`)
                let region = document.querySelector(rule.region)
                if (!region) {
                    console.error(`<${rule.region}> not found in this input source`)
                } else {
                    let conditions = rule.conditions
                    conditions.forEach(condition => {
                        let tag = condition.tag,
                            attr = condition.attr,
                            val = condition.val,
                            length = condition.length,
                            nodes

                        nodes = getNodesWithTag(region, tag)

                        if (nodes.length == 0) {
                            // 檢查tag是否存在
                            console.log(`\tThis HTML has no <${tag}> tag in ${rule.region}`)
                        } else if (attr && !val) {
                            // 檢查是否有指定attr
                            nodes = nodes.filter(node => hasAttr(node, attr))
                            console.log(`\tThere are ${nodes.length} <${tag}> without ${attr} attribute`)
                        } else if (attr && val) {
                            // 檢查是否有指定attr & 指定val
                            nodes = nodes.filter(node => hasAttrAndVal(node, attr, val))
                            console.log(`\tThere are ${nodes.length} <${tag}> without ${attr}=${val} attribute`)
                        }

                        if (length && nodes.length >= length) {
                            // 檢查length是否>=指定length
                            console.log(`\tThis HTML has more than ${length} <${tag}> tag: ${nodes.length}`)
                        }
                    })
                }
            })
        }
    }
    var getNodesWithTag = (region, tag) => {
        return region.querySelectorAll(tag)
    }
    var extractAttrs = (node) => {
        let attrs = {}
        if (node.rawAttrs) {
            node.rawAttrs.trim().split('\" ')
                .forEach(rawAttr => {
                    let [key, val] = rawAttr.split('=\"')
                    if (val) attrs[key] = val.replace('\"', '')
                })
        }
        return attrs
    }
    var hasAttr = (node, attr) => {
        let nodeAttrs = extractAttrs(node)
        return !nodeAttrs.hasOwnProperty(attr)
    }
    var hasAttrAndVal = (node, attr, val) => {
        let nodeAttrs = extractAttrs(node)
        return !(nodeAttrs.hasOwnProperty(attr) && nodeAttrs[attr] == val)
    }
}