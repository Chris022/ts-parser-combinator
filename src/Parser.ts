import { doEither, Either,Left,Right } from "./Either";
import { Message, ParseError } from "./Error";
import { State } from "./State";


class ParserValueError<L> extends Error{
    constructor(public left: L){super("ParserValueError")}
}

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

    //can and should only be used in do block!!
    parse(state:State):T{
        let res = this.unParse(state)
        if(res.isRight()){
            let [new_input,value] = res.value as [State,T]
            state.consumed = new_input.consumed
            state.unconsumed = new_input.unconsumed
            state.position = new_input.position
            return value
        }
        throw new ParserValueError(res.value as ParseError)
    }

    fmap<A>(func:(v:T)=>A){
        return new Parser(input => {
            return doEither(()=>{
                let [state,val] = this.unParse(input).get()
                return createPS(state,func(val))
            })
        })
    }

    many():Parser<T[]>{
        return new Parser(input => {
            let state = input
            let matches = []
            while(true){
                let res = this.unParse(state)
                if(res.isLeft()) break;
                let [new_state,value] = res.value as [State,T]
                state = new_state
                matches.push(value)
            }
            return createPS(state,matches)
        })
    }

    manyc():Parser<string>{
        return new Parser(input => {
            let state = input
            let matches = ""
            while(true){
                let res = this.unParse(state)
                if(res.isLeft()) break;
                let [new_state,value] = res.value as [State,T]
                state = new_state
                matches += value
            }
            return createPS(state,matches)
        })
    }

    many1():Parser<T[]>{
        return doParser(s=>{
            let res1 = this.parse(s)
            let res2 = this.many().parse(s)
            return [res1,...res2]
        })
    }

    manyc1():Parser<string>{
        return doParser(s=>{
            let res1 = this.parse(s)
            let res2 = this.manyc().parse(s)
            return res1 + res2
        })
    }

    try(default_v:T){
        return new Parser<T>(input => {
            let res = this.unParse(input)
            if(res.isRight()) return res 
            return createPS(input,default_v)
        })
    }

}

export function doParser<T>(func: (state:State)=>T):Parser<T>{
    return new Parser(input => {
        let state = input
        try {
            let res = func(state)
            return createPS(state,res)
        } catch (error) {
            if(error instanceof ParserValueError){
                return createPE((error.left as ParseError).messages)
            }else{
                throw error
            }
        }
    })

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