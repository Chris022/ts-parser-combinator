import { doEither, Either,Left,Right } from "./Either";
import { Message, ParseError } from "./Error";
import { State } from "./State";


//create Parse Error
export function createPE<R>(messages:Message[]):Either<ParseError,R>{
    return Left(new ParseError(messages))
}
//create Parse Succees
export function createPS<R>(state:State,val:R):Either<ParseError,[State,R]>{
    return Right([state,val])
}

export class Parser<T>{
    unParse: (input: State) => Either<ParseError, [State, T]>;
    public constructor(private runParser:(input:State)=>Either<ParseError,[State,T]>){
        this.unParse = (input:State)=> runParser(input.clone())
    }

    fmap<A>(func:(v:T)=>A){
        return new Parser(input => {
            return doEither(()=>{
                let [state,val] = this.unParse(input).get()
                return createPS(state,func(val))
            })
        })
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