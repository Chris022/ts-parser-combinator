import { Parser } from "./Parser";
import { State } from "./State";
/**
 *
 * Commonly used Char/String Parsers
 *
 */
export declare let satisfy: (func: (char: string) => boolean) => Parser<string>;
export declare let fail: <T>(state: State, unexpected: string, expected: string[] | string) => Parser<T>;
export declare let oneOf: (char_array: string) => Parser<string>;
export declare let noneOf: (char_array: string) => Parser<string>;
export declare let letter: () => Parser<string>;
export declare let digit: () => Parser<string>;
export declare let char: (char: string) => Parser<string>;
export declare let anyChar: () => Parser<string>;
export declare let string: (text: string) => Parser<string>;
export declare let lookAhead: (lenght: number) => Parser<string>;
