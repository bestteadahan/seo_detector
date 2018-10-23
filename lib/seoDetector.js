const htmlParser = require('node-html-parser')
const fs = require('fs')
const axios = require('axios')

module.exports = function seoDetector(rules) {
    this.rules = rules
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
                .catch(err => reject(err))
        })
    }
    this.getAttributeRule = () => {
        return this.rules
    }
    this.detect = (document) => {
        this.rules.forEach(rule => {
            // console.log(`[ Rule: ${rule.no} ]`)
            let region = document.querySelector(rule.region)
            let conditions = rule.conditions
            conditions.forEach(condition => {

                let tag = condition.tag,
                    attr = condition.attr,
                    val = condition.val,
                    length = condition.length,
                    nodes

                if (tag) {
                    nodes = this.getNodesWithTag(region, tag)
                } else {
                    let msg = `1 condition has no tag in Rule ${rule.no}, please check.`
                    throw msg
                }

                if (attr && val) {
                    // 是否有指定attr，且符合指定val
                    nodes = nodes.filter(node => this.hasAttrAndVal(node, attr, val))
                    console.log(`There are ${nodes.length} <${tag}> without ${attr}=${val} attribute`)
                } else if (attr) {
                    // 是否有指定attr
                    nodes = nodes.filter(node => this.hasAttr(node, attr))
                    console.log(`There are ${nodes.length} <${tag}> without ${attr} attribute`)
                } else if (length && nodes.length>= length) {
                    // 是否有指定length
                    console.log(`This HTML has more than ${length} <${tag}> tag: ${nodes.length}`)
                } else {
                    // 只驗證tag是否存在
                    console.log(`This HTML has no <${tag}> tag in ${rule.region}`)
                }
            })
        });
    }
    this.getNodesWithTag = (region, tag) => {
        return region.querySelectorAll(tag)
    }
    this.extractAttrs = (node) => {
        let attrs = {}
        if (node.rawAttrs) {
            node.rawAttrs.trim().split('\" ')
                .forEach(rawAttr => {
                    let [key, val] = rawAttr.split('=\"')
                    attrs[key] = val
                })
        }
        return attrs
    }
    this.hasAttr = (node, attr) => {
        let nodeAttrs = this.extractAttrs(node)
        return !nodeAttrs.hasOwnProperty(attr)
    }
    this.hasAttrAndVal = (node, attr, val) => {
        let nodeAttrs = this.extractAttrs(node)
        return !(nodeAttrs.hasOwnProperty(attr) && nodeAttrs[attr] == val)
    }
}