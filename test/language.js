"use strict";

module.exports = [
    {
        input: ["+10"],
        output: 10
    },
    {
        input: ["-10"],
        output: -10
    },
    {
        input: ["10"],
        output: "10"
    },
    {
        input: ["a"],
        output: "a"
    },
    {
        input: ["-"],
        output: null
    },
    {
        input: ["[", "]"],
        output: []
    },
    {
        input: ["[]"],
        output: []
    },
    {
        input: ["[", "[]", "]"],
        output: [[]]
    },
    {
        input: ["[", "--", "]"],
        output: {}
    },
    {
        input: ["[", "+10", "]"],
        output: [10]
    },
    {
        input: ["[", "--a", "+10", "]"],
        output: {a: 10}
    },
    {
        input: ["[", "--foo", "+10", "--bar", "20", "]"],
        output: {foo: 10, bar: "20"}
    },
    {
        input: ["[", "--foo=+10", "--bar=20", "]"],
        output: {foo: 10, bar: "20"}
    },
    {
        input: ["[", "-a", "+10", "]"],
        error: "Unexpected flag",
        index: 1
    },
    {
        input: ["[", "[", "hi", "]", "]"],
        output: [["hi"]]
    },
    {
        input: ["-t"],
        output: true
    },
    {
        input: ["-f"],
        output: false
    },
];
