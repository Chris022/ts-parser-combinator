export declare class State {
    consumed: string;
    position: number;
    unconsumed: string;
    constructor(unconsumed: string);
    getText(length: number): string;
    consume(length: number): string;
    length(): number;
    clone(): State;
}
