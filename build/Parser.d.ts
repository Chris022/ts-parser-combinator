import { Either } from "./Either";
import { ParseError } from "./Error";
import { State } from "./State";
export declare function createPE<R>(state: State, unexpected: string, expected: string[] | string): Either<ParseError, R>;
export declare function createPS<R>(state: State, val: R): Either<ParseError, [State, R]>;
export declare class Parser<T> {
    private runParser;
    unParse: (input: State) => Either<ParseError, [State, T]>;
    constructor(runParser: (input: State) => Either<ParseError, [State, T]>);
    parse(state: State): T;
    fmap<A>(func: (v: T) => A): Parser<A>;
    many(): Parser<T[]>;
    manyc(): Parser<string>;
    many1(): Parser<T[]>;
    manyc1(): Parser<string>;
    defaultValue(default_v: T): Parser<T>;
    optional(): Parser<void | T>;
    try(): Parser<T>;
    or<A>(p: Parser<A>): Parser<T | A>;
    left<A>(p: Parser<A>): Parser<T>;
    right<A>(p: Parser<A>): Parser<A>;
}
export declare function doParser<T>(func: (state: State, start: () => number, end: () => number) => T): Parser<T>;
