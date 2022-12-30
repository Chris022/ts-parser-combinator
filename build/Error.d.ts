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
    messages: Message[];
    message: string;
    constructor(messages: Message[]);
}
