import { HOK, Kind } from "../HOK";

export interface Functor<F extends HOK,A>{
    readonly fmap:<B>(f:(v:A)=>B)=>Kind<F,B>
}