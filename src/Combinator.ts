import { doEither } from "./Either";
import { Message, ParseError } from "./Error";
import { createPE, createPS, Parser } from "./Parser";


let choice = <T>(parsers:[Parser<T>])=> new Parser<T>(input => {
    let messages:Message[] = []

    for(var i = 0; i < parsers.length; i++){
        let pars_v = parsers[i].unParse(input)
        if(pars_v.isRight()) return pars_v
        messages = [...messages,...(pars_v.value as ParseError).messages]
    }
    return createPE(messages)
})

let option = <T>(parser:Parser<T>,default_v:T)=> new Parser<T>(input => {
    let res = parser.unParse(input)
    if(res.isRight()) return res 
    return createPS(input,default_v)
})

let between = <A,B,C>(open:Parser<A>,close:Parser<B>,p:Parser<C>)=> new Parser<C>(input => {
    return doEither(()=>{
        let [input_,_] = open.unParse(input).get()
        let [input__,res] = p.unParse(input_).get()
        let [input___,__]= close.unParse(input).get()
        return createPS(input___,res)
    })
})