# Simple SEO detector cli tool
![Travis CI](https://travis-ci.org/bestteadahan/seo_detector.svg?branch=master)

## Installation
```$ npm install tea-detector --global```

## Usage

### 1. Get Help
```
$ tea-detect -h

Options:
  -V, --version           output the version number
  -f, --file [name|path]  The input file path(ex: demo.html)
  -u, --url [addr]        The url source (ex: http://www.demo.com)
  -o, --output [name]     The output file name (ex: result.txt)
  -r, --rules [rule_no,...]    The number of rule that applied to detector, seperate by ","
  -h, --help              output usage information
```

### 2. Detect File/URL By Using Default Rules
```
// Read from file(s)
$ tea-detect -f file1[,file2...]

// Read from url(s)
$ tea-detect -u url1[,url2...]
```

### 3. Detect By Using Specific Rules
```
// Only use rule no. 1,3 and 5
$ tea-detect -f file.html -r 1,3,5
```

### 4. Default Rules
Please check `lib/seorule_conf_default.json` in this repository.
5 Default Rules Below:
1. Detect if any \<img> tag without alt attribute
2. Detect if any \<a> tag without rel attribute
3. In \<head> tag
    + Detect if header doesn’t have \<title> tag
    + Detect if header doesn’t have \<meta name=“descriptions” ... /> tag
    + Detect if header doesn’t have \<meta name=“keywords” ... /> tag
4. Detect if there’re more than 15 \<strong> tag in HTML
5. Detect if a HTML have more than one \<h1> tag

### 5. Custom Your Rule
Please create `seorule_conf.json` in your project's root.
Format:
+ Json array
+ Each element defines a SEO detect rule.
+ Keys in rule level (all required):
    + "no": \<string> Rule number
    + "region": \<string> The document area to be detected
    + "conditions": \<Array> The rule's conditions
+ Keys in condition level:
    + "tag": \<string> Tag name (required)
    + "attr": \<string> Tag attribute
    + "val": \<string> The attribute's value (only enabled while "attr" key is exist)
    + "length": \<number> The max. tag number (detected if there are more tags than this)

Example:
```
[
    {
        "no": "1",
        "region": "body",
        "conditions": [
            {
                "tag": "img",
                "attr": "alt"
            }
        ]
    },
    ...
]
```

### 6. Test Your Custom Rules Before Detect
**Remind:** Please make sure [mocha.js](https://mochajs.org/) has been installed in your env

+ copy `test/rule.spec.js` to your project
+ Modify your `package.json` as:
```
...
"scripts": {
    "test-myrules": "mocha test/rule.spec.js"
},
...
```
+ Run `npm test-myrules` in console

### 7. Save Detection Result
You can save all the results into file
```
$ tea-detect -f file.html -o log.txt
```
(note) It will also create an error log automatically.