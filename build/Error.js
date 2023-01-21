"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseError = exports.Unexpected = exports.Expected = exports.EndOfInputMessage = void 0;
class EndOfInputMessage {
    constructor() {
        this.message_text = "Unexpected end of input";
    }
}
exports.EndOfInputMessage = EndOfInputMessage;
class Expected {
    constructor(expected_value) {
        this.message_text = expected_value;
    }
}
exports.Expected = Expected;
class Unexpected {
    constructor(unexpected_value) {
        this.message_text = unexpected_value;
    }
}
exports.Unexpected = Unexpected;
class ParseError {
    constructor(unexpected, expected, state) {
        this.unexpected = unexpected;
        this.expected = expected;
        this.state = state;
    }
    toString() {
        return `syntax Error, unexpected ${this.unexpected}, expecting ${this.expected.join(" or ")}`;
    }
    merge(p2) {
        //unexpected should be the same for both
        //merge the expected arrays
        //use the state from p2
        return new ParseError(this.unexpected, [...this.expected, ...p2.expected], p2.state);
    }
}
exports.ParseError = ParseError;
