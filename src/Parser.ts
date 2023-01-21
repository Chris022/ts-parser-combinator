import { doEither, Either,Left,Right } from "./Either";
import { ParseError } from "./Error";
import { State } from "./State";


class ParserValueError<L> extends Error{
    constructor(public left: L){super("ParserValueError")}
}

//create Parse Error
export function createPE<R>(state:State,unexpected:string,expected:string[] | string):Either<ParseError,R>{
    if(Array.isArray(expected))
        return Left(new ParseError(unexpected,expected,state))
    return Left(new ParseError(unexpected,[expected],state))
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

                if(res.isLeft()){
                    //check if any input was consumed
                    let error_state = (res.value as ParseError).state
                    //if something was consume, return the error directly
                    if(error_state.length() < state.length()) return Left(res.value as ParseError)
                    break;
                } 

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

                if(res.isLeft()){
                    //check if any input was consumed
                    let error_state = (res.value as ParseError).state
                    //if something was consume, return the error directly
                    if(error_state.length() < state.length()) return Left(res.value as ParseError)
                    break;
                } 
                
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

    defaultValue(default_v:T){
        return new Parser<T>(input => {
            let res = this.unParse(input)
            if(res.isRight()) return res 
            return createPS(input,default_v)
        })
    }

    optional(){
        return new Parser<T | void>(input => {
            let base_input = input.clone()
            let res = this.unParse(input)
            if(res.isRight()) return res 
            //check if any input was consumed
            let error_state = (res.value as ParseError).state
            //if something was consumed, the error
            if(error_state.length() < input.length()) return Left(res.value as ParseError)
            //if nothing was consumed, return success
            return createPS(base_input,undefined)
        })
    }


    try(){
        return new Parser<T>(input => {
            let res = this.unParse(input.clone())
            if(res.isRight()) return res 
            let error = (res.value as ParseError)
            return Left(
                new ParseError(error.unexpected,error.expected,input)
            )
        })
    }

    or<A>(p:Parser<A>){
        return new Parser<T|A>(input => {
            let res1 = this.unParse(input)
            if(res1.isRight()) return res1

            //check if this consumed input
            let error_state = (res1.value as ParseError).state
            if(error_state.length() < input.length()) return Left((res1.value as ParseError))

            let res2 = p.unParse(input)
            if(res2.isRight()) return res2
            return Left((res1.value as ParseError).merge((res2.value as ParseError)))
        })
    }

    left<A>(p:Parser<A>):Parser<T>{
        return doParser((s)=>{
            let res = this.parse(s)
            p.parse(s)
            return res
        })
    }
    
    right<A>(p:Parser<A>):Parser<A>{
        return doParser((s)=>{
            this.parse(s)
            let res = p.parse(s)
            return res
        })
    }
}

export function doParser<T>(func: (state:State,start:()=>number,end:()=>number)=>T):Parser<T>{
    return new Parser(input => {
        let input_start = input.position
        let state = input
        try {
            let res = func(state,()=>input_start,()=>state.position-1)
            return createPS(state,res)
        } catch (error) {
            if(error instanceof ParserValueError){
                return Left((error.left as ParseError))
            }else{
                throw error
            }
        }
    })
}