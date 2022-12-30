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
    constructor(messages) {
        this.messages = messages;
        let expected_msg = messages.filter(message => message instanceof Expected).map(msg => msg.message_text).join(" or ");
        let unexpected_msg = messages.filter(message => message instanceof Unexpected).map(msg => msg.message_text).join(" or ");
        let EOI_msg = messages.filter(message => message instanceof EndOfInputMessage).map(msg => msg.message_text);
        this.message = "";
        if (EOI_msg.length > 1) {
            this.message = EOI_msg[0];
        }
        else if (unexpected_msg != "") {
            this.message = "Unexpected: " + unexpected_msg + "  ";
        }
        if (expected_msg != "") {
            this.message += "Expected: " + expected_msg;
        }
    }
}
exports.ParseError = ParseError;
