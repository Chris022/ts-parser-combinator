import { Parser } from "./Parser";
export declare let choice: <T>(parsers: Parser<T>[]) => Parser<T>;
export declare let chooseBest: <T>(parsers: Parser<T>[]) => Parser<T>;
export declare let sepBy: <A, B>(p: Parser<A>, seperator: Parser<B>) => Parser<A[]>;
export declare let defaultValue: <T>(parser: Parser<T>, default_v: T) => Parser<T>;
export declare let or: <A, B>(pa: Parser<A>, pb: Parser<B>) => Parser<A | B>;
export declare let between: <A, B, C>(open: Parser<A>, close: Parser<B>, p: Parser<C>) => Parser<C>;
export declare let hidden: (parsers: Parser<any>[]) => Parser<string>;
export declare let manyTill: <T, E>(p: Parser<T>, end: Parser<E>) => Parser<T[]>;
