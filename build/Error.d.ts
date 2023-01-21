import { State } from "./State";
export interface Message {
    message_text: string;
}
export declare class EndOfInputMessage implements Message {
    message_text: string;
    constructor();
}
export declare class Expected implements Message {
    message_text: string;
    constructor(expected_value: string);
}
export declare class Unexpected implements Message {
    message_text: string;
    constructor(unexpected_value: string);
}
export declare class ParseError {
    unexpected: string;
    expected: string[];
    state: State;
    constructor(unexpected: string, expected: string[], state: State);
    toString(): string;
    merge(p2: ParseError): ParseError;
}
