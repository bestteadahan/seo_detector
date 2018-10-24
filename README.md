# Simple SEO detector cli tool
***
## Installation
```$ npm install tea-detector --global```

## Usage
### 1. Help
```javascript
$ tea-detector -h

Options:
  -V, --version           output the version number
  -f, --file [name|path]  The input file path(ex: demo.html)
  -u, --url [addr]        The url source (ex: http://www.demo.com)
  -o, --output [name]     The output file name (ex: result.txt)
  -r, --rules [no,...]    The number of rule that applied to detector, seperate by ","
  -h, --help              output usage information
```

    "scripts": {
        "test": "mocha",
        "test-myrules":"mocha node_modules/tea-detector/test/rule.spec.js"
    }
