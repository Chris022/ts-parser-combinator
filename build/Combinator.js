"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manyTill = exports.hidden = exports.between = exports.or = exports.optional = exports.sepBy = exports.chooseBest = exports.choice = void 0;
const Either_1 = require("./Either");
const Error_1 = require("./Error");
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
let chooseBest = (parsers) => new Parser_1.Parser(input => {
    let messages = [];
    let best = null;
    for (var i = 0; i < parsers.length; i++) {
        let pars_v = parsers[i].unParse(input.clone());
        if (pars_v.isRight()) {
            let lenght = pars_v.value[0].position;
            if (best == null)
                best = [lenght, i];
            else if (lenght > best[0])
                best = [lenght, i];
            continue;
        }
        messages = [...messages, ...pars_v.value.messages];
    }
    if (best == null) {
        return (0, Parser_1.createPE)(messages);
    }
    return parsers[best[1]].unParse(input);
});
exports.chooseBest = chooseBest;
let sepBy = (p, seperator) => (0, Parser_1.doParser)((s) => {
    let value = (0, Parser_1.doParser)((s2) => {
        let head = p.parse(s2);
        let tail = seperator.right(p).many().parse(s2);
        return [head, ...tail];
    }).default([]).parse(s);
    return value;
});
exports.sepBy = sepBy;
let optional = (parser, default_v) => new Parser_1.Parser(input => {
    let res = parser.unParse(input);
    if (res.isRight())
        return res;
    return (0, Parser_1.createPS)(input, default_v);
});
exports.optional = optional;
let or = (pa, pb) => new Parser_1.Parser(input => {
    let res1 = pa.unParse(input);
    if (res1.isRight())
        return res1;
    let res2 = pb.unParse(input);
    if (res2.isRight())
        return res2;
    return (0, Parser_1.createPE)([...res1.value.messages, ...res2.value.messages]);
});
exports.or = or;
let between = (open, close, p) => new Parser_1.Parser(input => {
    return (0, Either_1.doEither)(() => {
        let [input_, _] = open.unParse(input).get();
        let [input__, res] = p.unParse(input_).get();
        let [input___, __] = close.unParse(input__).get();
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
let manyTill = (p, end) => {
    return new Parser_1.Parser(input => {
        let matches = [];
        let current_state = input;
        while (current_state.unconsumed.length != 0) {
            let end_res = end.try().unParse(current_state);
            if (end_res.isRight())
                return (0, Parser_1.createPS)(current_state, matches);
            let p_res = p.unParse(current_state);
            if (p_res.isLeft())
                return (0, Parser_1.createPE)(p_res.value.messages);
            let [new_input, value] = p_res.value;
            current_state = new_input;
            matches.push(value);
        }
        return (0, Parser_1.createPE)([new Error_1.EndOfInputMessage()]);
    });
};
exports.manyTill = manyTill;
//TODO: Implement hidden (as manipulator)
