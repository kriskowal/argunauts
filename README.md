
# Argunauts

## JSON and Argunauts

Type          | JSON                 | Arguments
------------- | -------------------- | ---------------------
Object        | `{"hello": "World"}` | `[ --hello World ]`
Array         | `["beep", "boop"]`   | `[ beep boop ]`
Array         | `[1, 2, 3]`          | `[ +1 +2 +3 ]`
Empty Array   | `[]`                 | `[ ]`
Object        | `{"a": 10, b: "20"}` | `[ --a +10 --b +20 ]`
Empty Object  | `{}`                 | `[ -- ]`
String        | `"hello"`            | `hello`
Number        | `1`                  | `+1`
Number        | `-1`                 | `-1`
Number        | `1e3`                | `+1e3`
True          | `true`               | `-t`
False         | `false`              | `-f`
Null          | `null`               | `-`

