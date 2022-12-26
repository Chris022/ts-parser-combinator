import { HOK, Kind } from "../HOK";
import { Functor } from "./Functor";

export interface Applicative<F extends HOK,T> extends Functor<F,T> { //
    // <*>
    readonly apply:<B>(f: Kind<F,(a:T)=>B>)=>Kind<F,B>;
    // *>
    readonly right:<B>(b: Kind<F,B>)=>Kind<F,B>;
    // <*
    readonly left:<B>(b: Kind<F,B>)=>Kind<F,T>;
}
