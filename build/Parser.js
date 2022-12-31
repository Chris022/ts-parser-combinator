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
function createPE(messages) {
    return (0, Either_1.Left)(new Error_1.ParseError(messages));
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
    default(default_v) {
        return new Parser(input => {
            let res = this.unParse(input);
            if (res.isRight())
                return res;
            return createPS(input, default_v);
        });
    }
    try() {
        return new Parser(input => {
            let res = this.unParse(input.clone());
            if (res.isRight())
                return res;
            return createPE(res.value.messages);
        });
    }
    or(p) {
        return new Parser(input => {
            let res1 = this.unParse(input);
            if (res1.isRight())
                return res1;
            let res2 = p.unParse(input);
            if (res2.isRight())
                return res2;
            return createPE([...res1.value.messages, ...res2.value.messages]);
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
                return createPE(error.left.messages);
            }
            else {
                throw error;
            }
        }
    });
}
exports.doParser = doParser;
/*
let many = <T>(p:Parser<T>):Parser<T[]> => {
    return new Parser<T[]>(input => {
        let current_state = input
        let matches:T[] = []
        let res = p.runParser(input)
        if(res.isLeft()) return Left(res.value as ParseError)

        while(1){
            let res = p.runParser(input)
            if(res.isLeft()) break
            current_state = res.get()[0]
            matches.push(res.get()[1])
        }

        return Right([current_state,matches])
    })
}

let stringParser = (text:string) => new Parser<string>(input => {
    if(input.length() < text.length) return createPE([new EndOfInputMessage(),new Expected(text)])
    let input_text = input.consume(text.length)
    if(input_text != text) return createPE([new Unexpected(input_text),new Expected(text)])
    return createPS(input,text)
})
*/ 
