"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hidden = exports.between = exports.optional = exports.choice = void 0;
const Either_1 = require("./Either");
const Parser_1 = require("./Parser");
let choice = (parsers) => new Parser_1.Parser(input => {
    let messages = [];
    for (var i = 0; i < parsers.length; i++) {
        let pars_v = parsers[i].unParse(input);
        if (pars_v.isRight())
            return pars_v;
        messages = [...messages, ...pars_v.value.messages];
    }
    return (0, Parser_1.createPE)(messages);
});
exports.choice = choice;
let optional = (parser, default_v) => new Parser_1.Parser(input => {
    let res = parser.unParse(input);
    if (res.isRight())
        return res;
    return (0, Parser_1.createPS)(input, default_v);
});
exports.optional = optional;
let between = (open, close, p) => new Parser_1.Parser(input => {
    return (0, Either_1.doEither)(() => {
        let [input_, _] = open.unParse(input).get();
        let [input__, res] = p.unParse(input_).get();
        let [input___, __] = close.unParse(input).get();
        return (0, Parser_1.createPS)(input___, res);
    });
});
exports.between = between;
let hidden = (parsers) => {
    return new Parser_1.Parser(input => {
        let state = input;
        for (var i = 0; i < parsers.length; i++) {
            let pars_v = parsers[i].unParse(input);
            if (pars_v.isLeft()) {
                return (0, Parser_1.createPE)(pars_v.value.messages);
            }
            let [new_input, _] = pars_v.value;
            state = new_input;
        }
        return (0, Parser_1.createPS)(state, "");
    });
};
exports.hidden = hidden;
//TODO: Implement hidden (as manipulator)
