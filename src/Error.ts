import { State } from "./State";

export interface Message{
    message_text:string;
}

export class EndOfInputMessage implements Message{
    message_text: string;
    constructor(){
        this.message_text = "Unexpected end of input"
    }
}

export class Expected implements Message{
    message_text: string;
    constructor(expected_value:string){
        this.message_text = expected_value
    }
}

export class Unexpected implements Message{
    message_text: string;
    constructor(unexpected_value:string){
        this.message_text = unexpected_value
    }
}

export class ParseError{
    constructor(public unexpected: string, public expected: string[], public state:State){}

    toString(){
        return `syntax Error, unexpected ${this.unexpected}, expecting ${this.expected.join(" or ")}`
    }

    merge(p2:ParseError){
        //unexpected should be the same for both
        //merge the expected arrays
        //use the state from p2
        return new ParseError(this.unexpected,[...this.expected,...p2.expected],p2.state,)
    }
}