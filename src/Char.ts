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
    return createPE([new Expected("a char that satisfies the function")])
})

export let oneOf = (char_array:string) => new Parser<string>(input => {
    let char = input.consume(1)
    if(char_array.indexOf(char) != -1) return createPS(input,char)
    return createPE([...char_array].map(c=>new Expected(c)))
})

export let noneOf = (char_array:string) => new Parser<string>(input => {
    let char = input.consume(1)
    if(char_array.indexOf(char) == -1) return createPS(input,char)
    return createPE([...char_array].map(c=>new Unexpected(c)))
})

export let letter = () => new Parser<string>(input => {
    let char = input.consume(1)
    let alpha = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
    if(alpha.indexOf(char.toLowerCase()) == -1) return createPS(input,char)
    return createPE([new Expected("a letter")])
})

export let digit = () => new Parser<string>(input => {
    let char = input.consume(1)
    let alpha = ["0","1","2","3","4","5","6","7","8","9"]
    if(alpha.indexOf(char) == -1) return createPS(input,char)
    return createPE([new Expected("a digit")])
})

export let char = (char:string) => new Parser<string>(input => {
    let char_i = input.consume(1)
    if(char == char_i) return createPS(input,char)
    return createPE([new Expected(char)])
})

export let anyChar = (char:string) => new Parser<string>(input => {
    return createPS(input,char)
    return createPE([new Expected("any char")])
})

export let string = (text:string)  => new Parser<string>(input => {
    let txt = input.consume(text.length)
    if(txt == text) return createPS(input,text)
    return createPE([new Expected(text)])
})

