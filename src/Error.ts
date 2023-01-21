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

        //use the sate to calculate the position
        let line = 1
        let column = 1
        let counter = 0
        while(true){
            if(counter >= this.state.consumed.length){
                break
            }
            let c = this.state.input.charAt(counter)
            if(c == "\n"){
                line++;
                column = 1;
            }else{
                column++;
            }

            counter ++
        }
        
        return `Syntax Error: line: ${line} column: ${column}
\t\t unexpected ${this.unexpected.replace("\n","\\n")}
\t\t expecting ${this.expected.join(" or ")}
        `
    }

    merge(p2:ParseError){
        //unexpected should be the same for both
        //merge the expected arrays
        //use the state from p2
        return new ParseError(this.unexpected,[...this.expected,...p2.expected],p2.state,)
    }
}