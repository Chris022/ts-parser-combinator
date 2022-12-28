
//Test multi data type parsers

import { digit } from "./Char";

class Test{
    constructor(public a:number,public b:string){}
}

let TestParser = digit().fmap(parseInt)