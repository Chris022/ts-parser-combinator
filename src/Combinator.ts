import { doEither, Left } from "./Either";
import { Message, ParseError } from "./Error";
import { createPE, createPS, Parser } from "./Parser";
import { State } from "./State";


export let choice = <T>(parsers:Parser<T>[])=> new Parser<T>(input => {
    let messages:Message[] = []

    for(var i = 0; i < parsers.length; i++){
        let pars_v = parsers[i].unParse(input)
        if(pars_v.isRight()) return pars_v
        messages = [...messages,...(pars_v.value as ParseError).messages]
    }
    return createPE(messages)
})

export let optional = <T>(parser:Parser<T>,default_v:T)=> new Parser<T>(input => {
    let res = parser.unParse(input)
    if(res.isRight()) return res 
    return createPS(input,default_v)
})

export let between = <A,B,C>(open:Parser<A>,close:Parser<B>,p:Parser<C>)=> new Parser<C>(input => {
    return doEither(()=>{
        let [input_,_] = open.unParse(input).get()
        let [input__,res] = p.unParse(input_).get()
        let [input___,__]= close.unParse(input).get()
        return createPS(input___,res)
    })
})

export let hidden = (parsers:Parser<any>[]):Parser<string>=>{
    return new Parser(input => {
        let state = input
        for(var i = 0; i < parsers.length; i++){
            let pars_v = parsers[i].unParse(input)
            if(pars_v.isLeft()){
                return createPE((pars_v.value as ParseError).messages);
            }
            let [new_input,_] = pars_v.value as [State,any]
            state = new_input
        }
        return createPS(state,"")
    })
}

//TODO: Implement hidden (as manipulator)