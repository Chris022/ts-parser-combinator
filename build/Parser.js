"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doParser = exports.Parser = exports.createPS = exports.createPE = void 0;
const Either_1 = require("./Either");
const Error_1 = require("./Error");
class ParserValueError extends Error {
    constructor(left) {
        super("ParserValueError");
        this.left = left;
    }
}
//create Parse Error
function createPE(state, unexpected, expected) {
    if (Array.isArray(expected))
        return (0, Either_1.Left)(new Error_1.ParseError(unexpected, expected, state));
    return (0, Either_1.Left)(new Error_1.ParseError(unexpected, [expected], state));
}
exports.createPE = createPE;
//create Parse Succees
function createPS(state, val) {
    return (0, Either_1.Right)([state, val]);
}
exports.createPS = createPS;
class Parser {
    constructor(runParser) {
        this.runParser = runParser;
        this.unParse = (input) => runParser(input.clone());
    }
    //can and should only be used in do block!!
    parse(state) {
        let res = this.unParse(state);
        if (res.isRight()) {
            let [new_input, value] = res.value;
            state.consumed = new_input.consumed;
            state.unconsumed = new_input.unconsumed;
            state.position = new_input.position;
            return value;
        }
        throw new ParserValueError(res.value);
    }
    fmap(func) {
        return new Parser(input => {
            return (0, Either_1.doEither)(() => {
                let [state, val] = this.unParse(input).get();
                return createPS(state, func(val));
            });
        });
    }
    many() {
        return new Parser(input => {
            let state = input;
            let matches = [];
            while (true) {
                let res = this.unParse(state);
                if (res.isLeft())
                    break;
                let [new_state, value] = res.value;
                state = new_state;
                matches.push(value);
            }
            return createPS(state, matches);
        });
    }
    manyc() {
        return new Parser(input => {
            let state = input;
            let matches = "";
            while (true) {
                let res = this.unParse(state);
                if (res.isLeft())
                    break;
                let [new_state, value] = res.value;
                state = new_state;
                matches += value;
            }
            return createPS(state, matches);
        });
    }
    many1() {
        return doParser(s => {
            let res1 = this.parse(s);
            let res2 = this.many().parse(s);
            return [res1, ...res2];
        });
    }
    manyc1() {
        return doParser(s => {
            let res1 = this.parse(s);
            let res2 = this.manyc().parse(s);
            return res1 + res2;
        });
    }
    defaultValue(default_v) {
        return new Parser(input => {
            let res = this.unParse(input);
            if (res.isRight())
                return res;
            return createPS(input, default_v);
        });
    }
    optional() {
        return new Parser(input => {
            let base_input = input.clone();
            let res = this.unParse(input);
            if (res.isRight())
                return res;
            return createPS(base_input, undefined);
        });
    }
    try() {
        return new Parser(input => {
            let res = this.unParse(input.clone());
            if (res.isRight())
                return res;
            return (0, Either_1.Left)(res.value);
        });
    }
    or(p) {
        return new Parser(input => {
            let res1 = this.unParse(input);
            if (res1.isRight())
                return res1;
            //check if this consumed input
            let error_state = res1.value.state;
            if (error_state.length() < input.length())
                return (0, Either_1.Left)(res1.value);
            let res2 = p.unParse(input);
            if (res2.isRight())
                return res2;
            return (0, Either_1.Left)(res1.value.merge(res2.value));
        });
    }
    left(p) {
        return doParser((s) => {
            let res = this.parse(s);
            p.parse(s);
            return res;
        });
    }
    right(p) {
        return doParser((s) => {
            this.parse(s);
            let res = p.parse(s);
            return res;
        });
    }
}
exports.Parser = Parser;
function doParser(func) {
    return new Parser(input => {
        let input_start = input.position;
        let state = input;
        try {
            let res = func(state, () => input_start, () => state.position - 1);
            return createPS(state, res);
        }
        catch (error) {
            if (error instanceof ParserValueError) {
                return (0, Either_1.Left)(error.left);
            }
            else {
                throw error;
            }
        }
    });
}
exports.doParser = doParser;
