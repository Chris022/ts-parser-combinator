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
    message: string;
    constructor(public messages:Message[]){
        let expected_msg = messages.filter(message=>message instanceof Expected).map(msg=>msg.message_text).join(" or ")
        let unexpected_msg = messages.filter(message=>message instanceof Unexpected).map(msg=>msg.message_text).join(" or ")
        let EOI_msg = messages.filter(message=>message instanceof EndOfInputMessage).map(msg=>msg.message_text)

        this.message = ""
        if(EOI_msg.length > 1){
            this.message = EOI_msg[0]
        }else if(unexpected_msg != ""){
            this.message = "Unexpected: " + unexpected_msg + "  "
        }
        if(expected_msg != ""){
            this.message += "Expected: " + expected_msg
        }
    }
}