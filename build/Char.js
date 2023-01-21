"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookAhead = exports.string = exports.anyChar = exports.char = exports.digit = exports.letter = exports.noneOf = exports.oneOf = exports.fail = exports.satisfy = void 0;
const Parser_1 = require("./Parser");
/**
 *
 * Commonly used Char/String Parsers
 *
 */
let satisfy = (func) => new Parser_1.Parser(input => {
    let char = input.consume(1);
    if (func(char))
        return (0, Parser_1.createPS)(input, char);
    return (0, Parser_1.createPE)(input, char, "a char that satisfies the given function");
});
exports.satisfy = satisfy;
let fail = (state, unexpected, expected) => new Parser_1.Parser(input => {
    return (0, Parser_1.createPE)(state, unexpected, expected);
});
exports.fail = fail;
let oneOf = (char_array) => new Parser_1.Parser(input => {
    let char = input.consume(1);
    if (char_array.indexOf(char) != -1)
        return (0, Parser_1.createPS)(input, char);
    let unexpected = input.length() == 0 ? "EndOfInput" : char;
    return (0, Parser_1.createPE)(input, unexpected, [...char_array]);
});
exports.oneOf = oneOf;
let noneOf = (char_array) => new Parser_1.Parser(input => {
    let char = input.consume(1);
    if (char_array.indexOf(char) == -1)
        return (0, Parser_1.createPS)(input, char);
    let unexpected = input.length() == 0 ? "EndOfInput" : char;
    return (0, Parser_1.createPE)(input, unexpected, ["any char execpt: " + [...char_array][0], ...[...char_array].slice(1)]);
});
exports.noneOf = noneOf;
let letter = () => new Parser_1.Parser(input => {
    let char = input.consume(1);
    let alpha = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    if (alpha.indexOf(char.toLowerCase()) != -1)
        return (0, Parser_1.createPS)(input, char);
    let unexpected = input.length() == 0 ? "EndOfInput" : char;
    return (0, Parser_1.createPE)(input, unexpected, "any letter a-z,A-Z");
});
exports.letter = letter;
let digit = () => new Parser_1.Parser(input => {
    let char = input.consume(1);
    let alpha = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    if (alpha.indexOf(char) != -1)
        return (0, Parser_1.createPS)(input, char);
    let unexpected = input.length() == 0 ? "EndOfInput" : char;
    return (0, Parser_1.createPE)(input, unexpected, "any digit 0-9");
});
exports.digit = digit;
let char = (char) => new Parser_1.Parser(input => {
    let char_i = input.consume(1);
    if (char == char_i)
        return (0, Parser_1.createPS)(input, char);
    let unexpected = input.length() == 0 ? "EndOfInput" : char_i;
    return (0, Parser_1.createPE)(input, unexpected, char);
});
exports.char = char;
let anyChar = () => new Parser_1.Parser(input => {
    let char = input.consume(1);
    return (0, Parser_1.createPS)(input, char);
});
exports.anyChar = anyChar;
let string = (text) => new Parser_1.Parser(input => {
    let txt = input.consume(text.length);
    if (txt == text)
        return (0, Parser_1.createPS)(input, text);
    let unexpected = input.length() == 0 ? "EndOfInput" : txt;
    return (0, Parser_1.createPE)(input, unexpected, text);
});
exports.string = string;
//returns the next n unconsumed characters without consuming them
let lookAhead = (lenght) => new Parser_1.Parser(input => {
    let txt = input.getText(length);
    return (0, Parser_1.createPS)(input, txt);
});
exports.lookAhead = lookAhead;
