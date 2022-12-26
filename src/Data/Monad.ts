import { Applicative } from "./Applicative";
import { HOK, Kind } from "../HOK";

export interface Monad<M extends HOK,T> extends Applicative<M,T>{
    // >>=
    bind:<A>(f: (val: T) => Kind<M,A>)=> Kind<M,A>;

    // create Monad with object in it
    do:()=>Kind<M,Record<string,any>>;

    /*
    end<A,M extends HOK,T>(f: (val: T) => Kind<M,A>): Kind<M,A>{
        return(this.bind(f))
    }

    assign<A>(var_name:string,action:(scope:Record<string,any>)=>Monad<A>):Monad<Record<string,any>>{
        return (this.fmap(
            unpacked_scope => {
                return action(unpacked_scope as Record<string,any>).fmap(
                    unpacked_value => {
                        return Object.assign({}, unpacked_scope as Record<string,any>, { [var_name]: unpacked_value });
                    }
                ) as Monad<Record<string,any>>
            }
        ) as Monad<Monad<Record<string,any>>>).bind(a => a)
    }
    */
}