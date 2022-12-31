import { string } from "./Char";
import { doEither, Left } from "./Either";
import { EndOfInputMessage, Message, ParseError } from "./Error";
import { createPE, createPS, doParser, Parser } from "./Parser";
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

let chooseBest = <T>(parsers:Parser<T>[])=> new Parser<T>(input => {
    let messages:Message[] = []
    let best:null|[number,number] = null
    for(var i = 0; i < parsers.length; i++){
        let pars_v = parsers[i].unParse(input.clone())
        if(pars_v.isRight()){
            let lenght = (pars_v.value as [State,T])[0].position
            if(best == null) best = [lenght,i]
            else if(lenght > best[0]) best = [lenght,i]
            continue
        }
        messages = [...messages,...(pars_v.value as ParseError).messages]
    }
    if(best == null){
        return createPE(messages)
    }
    return parsers[best[1]].unParse(input)
})

export let optional = <T>(parser:Parser<T>,default_v:T)=> new Parser<T>(input => {
    let res = parser.unParse(input)
    if(res.isRight()) return res 
    return createPS(input,default_v)
})

export let or = <A,B>(pa:Parser<A>,pb:Parser<B>)=> new Parser<A|B>(input => {
    let res1 = pa.unParse(input)
    if(res1.isRight()) return res1
    let res2 = pb.unParse(input)
    if(res2.isRight()) return res2
    return createPE([...(res1.value as ParseError).messages,...(res2.value as ParseError).messages])
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
                return createPE((pars_v.value as ParseError).messages);
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
            if(p_res.isLeft()) return createPE((p_res.value as ParseError).messages)
            let [new_input,value] = p_res.value as [State,T]
            current_state = new_input
            matches.push(value)
        }
        return createPE([new EndOfInputMessage()])
    })
}

//TODO: Implement hidden (as manipulator)