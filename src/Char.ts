import { Expected, Unexpected } from "./Error"
import { createPE, createPS, Parser } from "./Parser"
import { State } from "./State"

/**
 * 
 * Commonly used Char/String Parsers
 * 
 */

export let satisfy = (func: (char:string)=>boolean) => new Parser<string>(input => {
    let char = input.consume(1)
    if(func(char)) return createPS(input,char)
    return createPE(input,char,"a char that satisfies the given function")
})

export let fail = <T>(state:State,unexpected:string,expected:string[] | string) => new Parser<T>(input => {
    return createPE(state,unexpected,expected)
})

export let oneOf = (char_array:string) => new Parser<string>(input => {
    let char = input.consume(1)
    if(char_array.indexOf(char) != -1) return createPS(input,char)
    return createPE(input,char,[...char_array])
})

export let noneOf = (char_array:string) => new Parser<string>(input => {
    let char = input.consume(1)
    if(char_array.indexOf(char) == -1) return createPS(input,char)
    return createPE(input,char,["any char execpt: " +[...char_array][0],...[...char_array].slice(1)])
})

export let letter = () => new Parser<string>(input => {
    let char = input.consume(1)
    let alpha = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
    if(alpha.indexOf(char.toLowerCase()) != -1) return createPS(input,char)
    return createPE(input,char,"any letter a-z,A-Z")
})

export let digit = () => new Parser<string>(input => {
    let char = input.consume(1)
    let alpha = ["0","1","2","3","4","5","6","7","8","9"]
    if(alpha.indexOf(char) != -1) return createPS(input,char)
    return createPE(input,char,"any digit 0-9")
})

export let char = (char:string) => new Parser<string>(input => {
    let char_i = input.consume(1)
    if(char == char_i) return createPS(input,char)
    return createPE(input,char_i,char)
})

export let anyChar = () => new Parser<string>(input => {
    let char = input.consume(1)
    return createPS(input,char)
})

export let string = (text:string)  => new Parser<string>(input => {
    let txt = input.consume(text.length)
    if(txt == text) return createPS(input,text)
    return createPE(input,txt,text)
})

 //returns the next n unconsumed characters without consuming them
export let lookAhead = (lenght:number) => new Parser<string>(input => {
    let txt = input.getText(length)
    return createPS(input,txt)
})