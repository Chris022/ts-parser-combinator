
//Test multi data type parsers

import { digit, string } from "./Char";
import { createPS, doParser, Parser } from "./Parser";
import { State } from "./State";

class Test{
    constructor(public a:number,public b:string){}
}

let TestParser = doParser(s=>{

    let number_part = digit().fmap(parseInt).parse(s)

    let string_part = string("test").parse(s)

    return new Test(number_part,string_part)
})

console.log(TestParser.unParse(new State("1testilol")))