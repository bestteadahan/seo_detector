// rules
module.exports = [
    {
        no: '1',
        region: 'body',
        conditions: [
            {
                tag: 'img',
                attr: 'alt',
                val: undefined
            }
        ]
    },
    {
        no: '2',
        region: 'body',
        conditions: [
            {
                tag: 'a',
                attr: 'rel',
                val: undefined
            }
        ]
    },
    {
        no: '3',
        region: 'head',
        conditions: [
            {
                tag: 'title'
            },
            {
                tag: 'meta',
                attr: 'name',
                val: 'descriptions'
            },
            {
                tag: 'meta',
                attr: 'name',
                val: 'keywords'
            }
        ]
    },
    {
        no: '4',
        region: 'html',
        conditions: [
            {
                tag: 'strong',
                length: 15
            }
        ]
    },
    {
        no: '5',
        region: 'html',
        conditions: [
            {
                tag: 'h1',
                length: 1
            }
        ]
    }
]