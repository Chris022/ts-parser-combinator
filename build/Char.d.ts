import { Parser } from "./Parser";
/**
 *
 * Commonly used Char/String Parsers
 *
 */
export declare let satisfy: (func: (char: string) => boolean) => Parser<string>;
export declare let oneOf: (char_array: string) => Parser<string>;
export declare let noneOf: (char_array: string) => Parser<string>;
export declare let letter: () => Parser<string>;
export declare let digit: () => Parser<string>;
export declare let char: (char: string) => Parser<string>;
export declare let anyChar: (char: string) => Parser<string>;
export declare let string: (text: string) => Parser<string>;