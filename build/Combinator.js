"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manyTill = exports.hidden = exports.between = exports.or = exports.defaultValue = exports.sepBy = exports.chooseBest = exports.choice = void 0;
const Either_1 = require("./Either");
const Parser_1 = require("./Parser");
let choice = (parsers) => new Parser_1.Parser(input => {
    let errors = [];
    for (var i = 0; i < parsers.length; i++) {
        let pars_v = parsers[i].unParse(input);
        if (pars_v.isRight())
            return pars_v;
        //check if any input was consume
        let error_state = pars_v.value.state;
        if (error_state.length() < input.length())
            return (0, Either_1.Left)(pars_v.value);
        errors.push(pars_v.value);
    }
    return (0, Either_1.Left)(errors.reduce((x, xs) => x.merge(xs)));
});
exports.choice = choice;
let chooseBest = (parsers) => new Parser_1.Parser(input => {
    let errors = [];
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
        errors.push(pars_v.value);
    }
    if (best == null) {
        return (0, Either_1.Left)(errors.reduce((x, xs) => x.merge(xs)));
    }
    return parsers[best[1]].unParse(input);
});
exports.chooseBest = chooseBest;
let sepBy = (p, seperator) => (0, Parser_1.doParser)((s) => {
    let value = (0, Parser_1.doParser)((s2) => {
        let head = p.parse(s2);
        let tail = seperator.right(p).many().parse(s2);
        return [head, ...tail];
    }).defaultValue([]).parse(s);
    return value;
});
exports.sepBy = sepBy;
let defaultValue = (parser, default_v) => new Parser_1.Parser(input => {
    let res = parser.unParse(input);
    if (res.isRight())
        return res;
    return (0, Parser_1.createPS)(input, default_v);
});
exports.defaultValue = defaultValue;
//INFO! the second one is only tried if the first one didn't consume any input!
let or = (pa, pb) => new Parser_1.Parser(input => {
    let res1 = pa.unParse(input);
    if (res1.isRight())
        return res1;
    //check if pa consumed input
    let error_state = res1.value.state;
    if (error_state.length() < input.length())
        return (0, Either_1.Left)(res1.value);
    let res2 = pb.unParse(input);
    if (res2.isRight())
        return res2;
    return (0, Either_1.Left)(res1.value.merge(res2.value));
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
                return (0, Either_1.Left)(pars_v.value);
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
                return (0, Either_1.Left)(p_res.value);
            let [new_input, value] = p_res.value;
            current_state = new_input;
            matches.push(value);
        }
        return (0, Parser_1.createPS)(current_state, matches);
    });
};
exports.manyTill = manyTill;
