[![Build Status](https://travis-ci.org/pmelisko/schema2doc.svg?branch=master)](https://travis-ci.org/pmelisko/schema2doc)

# schema2doc

Schema to document generator, transform JSON schema to human readably form.

## Important

This tool is still on early development and is missing support for many
important features. Please report any bugs you find, the code is only as good
as the test cases.

## Goals

 - to easily get overview about your schemas
 - support JSON schema draft 3 and 4
 - command line interface (cli).
 - support $ref

## CLI

You can also use the simple command line interface to process `stdin` and
`stdout`

```sh
npm install -g schema2doc
```

### Usage:

````sh
Usage:
schema2doc [-h|-r|-l|-c|-o <FILE>]
options:
        -h print this help
        -r print to raw format (default)
        -l print to html format, table and simple css
        -c print to csv format
        -a print constraints, only intervals are now supported
        -o <FILE> save output to a file (file will be created and overwritten)
````

### Installation

Installation is simple and only take few steps

1. clone repo

	```sh
	git clone https://github.com/pmelisko/schema2doc.git
	```

2. move to newly cloned repo

3. install tool

	```sh
	npm install --global
	```

4. ready to go

	```sh
	schema2doc
	```

### Examples:
cat schema.json | schema2doc

####input schema

```sh
{
        "type": "object",
        "id": "Semaphore.POST.req.body.schema.json",
        "$schema": "http://json-schema.org/draft-03/schema",
        "additionalProperties": false,
        "properties": {
                "flagName": {
                        "type": [
                                "string",
                                "null"
                        ],
                        "maxLength": 128,
                        "required": true,
                        "minLength": 1
                },
                "flagStatus": {
                        "type": "boolean",
                        "required": true
                }
        }
}
```

####Raw format (default options or -r)

```sh
RQ/NN   Field   Type    Format  Desc
------  ------  ------  ------  ------
+-      flagName        string,null
++      flagStatus      boolean
```


####HTML format (option -l)

```html
<html>
 <meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>
 <head>
  <style type='text/css'>table,th,td {     margin: 0;      padding: 0;     border: 1px solid black;border-collapse: collapse;}table table {width: 100%;border: 0;}td {vertical-align:top;}td.name {font-weight:bold;color: blue;   width: 150px;}
  </style>
 </head>
 <body>
  <table>
   <tr>
    <th>RQ/NN</th>
    <th>Field</th>
    <th>Type</th>
    <th>Format</th>
    <th>Desc</th>
   </tr>
   <tr>
    <td class='name'>+-</td>
    <td>flagName</td>
    <td>string,null</td>
    <td></td>
    <td></td>
   </tr>
   <tr>
    <td class='name'>++</td>
    <td>flagStatus</td>
    <td>boolean</td>
    <td></td>
    <td></td>
   </tr>
  </table>
 </body>
</html>
```


####CSV format (option -c)

```sh
sep=;
RQ/NN;Field;Type;Format;Desc
+-;flagName;string,null;;
++;flagStatus;boolean;;
```
## Links

 - JSON schema draft 3 [https://tools.ietf.org/html/draft-zyp-json-schema-03](https://tools.ietf.org/html/draft-zyp-json-schema-03 "Json schema draft 3 ")

## License

Released under the MIT license


