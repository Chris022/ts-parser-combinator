import { Parser } from "./Parser";
export declare let choice: <T>(parsers: [Parser<T>]) => Parser<T>;
export declare let optional: <T>(parser: Parser<T>, default_v: T) => Parser<T>;
export declare let between: <A, B, C>(open: Parser<A>, close: Parser<B>, p: Parser<C>) => Parser<C>;
export declare let hidden: (parsers: Parser<any>[]) => Parser<string>;
