# schema2doc

Schema to document generator, transform json schema to human readably form.

## Important

This tool is still on early development and is missing support for many
important features. Please report any bugs you find, the code is only as good
as the test cases.

## Goals

 - *granular* control about white spaces, indent and line breaks.
 - command line interface (cli).
 - be non-destructive.
 - support for local/global config file so settings can be shared between team
   members.
 - support most popular style guides (Google, jQuery, Idiomatic.js).
 - be the best JavaScript code formatter.

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

### Examples:

```sh
TODO
```
## License

Released under the MIT license


