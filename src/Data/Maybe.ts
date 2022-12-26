import { HOK } from "../HOK"
import { Monad } from "../Control/Monad"

interface MaybeHOK extends HOK{
    readonly type: Maybe<this["_A"]>
}

export abstract class Maybe<T> implements Monad<MaybeHOK,T>{
    return(val: T):Maybe<T>{
        return new Just(val)
    }
    fmap <B>(f: (v: T) => B):Maybe<B>{
        if(this instanceof Just){
            return new Just(f(this.value))
        }
        return new Nothing()
    }
    apply <B>(f: Maybe<(a: T) => B>):Maybe<B>{
        if(f instanceof Just){
            return this.fmap(f.value)
        }
        return new Nothing()
    }
    right <B>(b: Maybe<B>):Maybe<B>{
        if(this instanceof Just){
            return b
        }
        return new Nothing()
    }
    left <B>(b: Maybe<B>):Maybe<T>{
        if(b instanceof Just){
            return this
        }
        return new Nothing()
    }
    bind <A>(f: (val: T) => Maybe<A>):Maybe<A>{
        if(this instanceof Just){
            return f(this.value)
        }
        return new Nothing()
    }
    do ():Maybe<Record<string, any>>{
        return new Just({} as Record<string,T>)
    }

}

export class Nothing<T> extends Maybe<T>{
    constructor(){super()}
}

export class Just<T> extends Maybe<T>{
    constructor(public value:T){super()}
}