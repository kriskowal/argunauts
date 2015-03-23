
# Argunauts

## JSON and the Argunauts

This package contains a parser for Argument Object Notation (ArgON).
All objects expressible in JSON are convenient to express at the command line
with ArgON.

Type          | JSON                 | ArgON
------------- | -------------------- | ---------------------
Object        | `{"hello": "World"}` | `[ --hello World ]`
Array         | `["beep", "boop"]`   | `[ beep boop ]`
Array         | `[1, 2, 3]`          | `[ 1 2 3 ]`
Empty Array   | `[]`                 | `[ ]` or `[]`
Object        | `{"a": 10, b: 20}`   | `[ --a 10 --b 20 ]`
Empty Object  | `{}`                 | `[ -- ]`
Number        | `1`                  | `1`
Number        | `-1`                 | `-1`
Number        | `1e3`                | `1e3`
String        | `"hello"`            | `hello`
String        | `"hello world"`      | `'hello world'`
String        | `"10"`               | `-- 10`
String        | `"-10"`              | `-- -10`
String        | `"-"`                | `-- -`
String        | `"--"`               | `-- --`
True          | `true`               | `-t`
False         | `false`              | `-f`
Null          | `null`               | `-n`

Argunauts includes an `argon` command which accepts ArgOn arguments and the `-t`
or `--tab` option and prints the corresponding JSON.
