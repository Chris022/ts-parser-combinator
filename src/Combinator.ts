import { string } from "./Char";
import { doEither, Left } from "./Either";
import { ParseError } from "./Error";
import { createPE, createPS, doParser, Parser } from "./Parser";
import { State } from "./State";


export let choice = <T>(parsers:Parser<T>[])=> new Parser<T>(input => {
    let errors:ParseError[] = []

    for(var i = 0; i < parsers.length; i++){
        let pars_v = parsers[i].unParse(input)
        if(pars_v.isRight()) return pars_v

        //check if any input was consume
        let error_state = (pars_v.value as ParseError).state
        if(error_state.length() < input.length()) return Left((pars_v.value as ParseError))

        errors.push(pars_v.value as ParseError)
    }
    return Left(
        errors.reduce((x,xs)=>x.merge(xs))
    )
})

export let chooseBest = <T>(parsers:Parser<T>[])=> new Parser<T>(input => {
    let errors:ParseError[] = []
    let best:null|[number,number] = null
    for(var i = 0; i < parsers.length; i++){
        let pars_v = parsers[i].unParse(input.clone())
        if(pars_v.isRight()){
            let lenght = (pars_v.value as [State,T])[0].position
            if(best == null) best = [lenght,i]
            else if(lenght > best[0]) best = [lenght,i]
            continue
        }
        errors.push(pars_v.value as ParseError)
    }
    if(best == null){
        return Left(
            errors.reduce((x,xs)=>x.merge(xs))
        )
    }
    return parsers[best[1]].unParse(input)
})

export let sepBy = <A,B>(p:Parser<A>,seperator:Parser<B>) => doParser((s)=>{
    let value = doParser((s2)=>{
        let head = p.parse(s2)
        let tail = seperator.right(p).many().parse(s2)
        return [head,...tail]
    }).defaultValue([]).parse(s)
    return value
})

export let defaultValue = <T>(parser:Parser<T>,default_v:T)=> new Parser<T>(input => {
    let res = parser.unParse(input)
    if(res.isRight()) return res 
    return createPS(input,default_v)
})


//INFO! the second one is only tried if the first one didn't consume any input!
export let or = <A,B>(pa:Parser<A>,pb:Parser<B>)=> new Parser<A|B>(input => {
    let res1 = pa.unParse(input)
    if(res1.isRight()) return res1

    //check if pa consumed input
    let error_state = (res1.value as ParseError).state
    if(error_state.length() < input.length()) return Left((res1.value as ParseError))

    let res2 = pb.unParse(input)
    if(res2.isRight()) return res2
    return Left((res1.value as ParseError).merge((res2.value as ParseError)))
})

export let between = <A,B,C>(open:Parser<A>,close:Parser<B>,p:Parser<C>)=> new Parser<C>(input => {
    return doEither(()=>{
        let [input_,_] = open.unParse(input).get()
        let [input__,res] = p.unParse(input_).get()
        let [input___,__]= close.unParse(input__).get()
        return createPS(input___,res)
    })
})

export let hidden = (parsers:Parser<any>[]):Parser<string>=>{
    return new Parser(input => {
        let state = input
        for(var i = 0; i < parsers.length; i++){
            let pars_v = parsers[i].unParse(input)
            if(pars_v.isLeft()){
                return Left((pars_v.value as ParseError));
            }
            let [new_input,_] = pars_v.value as [State,any]
            state = new_input
        }
        return createPS(state,"")
    })
}

export let manyTill = <T,E>(p:Parser<T>,end:Parser<E>):Parser<T[]> => {
    return new Parser<T[]>(input=>{
        let matches:T[] = []
        let current_state = input
        while(current_state.unconsumed.length != 0){
            let end_res = end.try().unParse(current_state)
            if(end_res.isRight()) return createPS(current_state,matches)
            let p_res = p.unParse(current_state)
            if(p_res.isLeft()) return Left(p_res.value as ParseError)
            let [new_input,value] = p_res.value as [State,T]
            current_state = new_input
            matches.push(value)
        }
        return createPS(current_state,matches)
    })
}