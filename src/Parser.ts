import { doEither, Either,Left,Right } from "./Either";

class State{
    consumed: string;
    position: number;
    unconsumed: string;
    public constructor(unconsumed:string){
        this.consumed = ""
        this.position = 0
        this.unconsumed = unconsumed
    }
    getText(length:number):string{
        return this.unconsumed.substring(0,length)
    }
    consume(length:number):string{
        let consumed_text = this.unconsumed.substring(0,length)
        this.consumed += consumed_text
        this.unconsumed = this.unconsumed.substring(length)
        return consumed_text
    }
    length():number{
        return this.unconsumed.length
    }
}

//create Parse Error
function createPE<R>(messages:Message[]):Either<ParseError,R>{
    return Left(new ParseError(messages))
}
//create Parse Succees
function createPS<R>(state:State,val:R):Either<ParseError,[State,R]>{
    return Right([state,val])
}

class Parser<T>{
    public constructor(public runParser:(input:State)=>Either<ParseError,[State,T]>){
    }

    /*    
    many():Parser<T[]>{
        return many(this)
    }
    */
}



/*
let many = <T>(p:Parser<T>):Parser<T[]> => {
    return new Parser<T[]>(input => {
        let current_state = input
        let matches:T[] = []
        let res = p.runParser(input)
        if(res.isLeft()) return Left(res.value as ParseError)

        while(1){
            let res = p.runParser(input)
            if(res.isLeft()) break
            current_state = res.get()[0]
            matches.push(res.get()[1])
        }

        return Right([current_state,matches])
    })
}

let stringParser = (text:string) => new Parser<string>(input => {
    if(input.length() < text.length) return createPE([new EndOfInputMessage(),new Expected(text)])
    let input_text = input.consume(text.length)
    if(input_text != text) return createPE([new Unexpected(input_text),new Expected(text)])
    return createPS(input,text)
})
*/