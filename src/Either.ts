export type Either<L,R> = EitherClass<L,R>

class EitherValueError<L> extends Error{
    constructor(public left: L){super("EitherValueError")}
}

class EitherClass<L,R>{
    constructor(public error:boolean,public value:L|R){}
    get():R{
        if(!this.error) return this.value as R
        if(this.error) throw new EitherValueError(this.value)
        throw new Error("Something weird happend in the Either class")
    }
    isLeft():boolean{
        return this.error ? true : false
    }
    isRight():boolean{
        return !this.error ? true : false
    }
}

export function Left<L,R>(value:L){
    return new EitherClass<L,R>(true,value) as Either<L,R>
}

export function Right<L,R>(value:R){
    return new EitherClass<L,R>(false,value) as Either<L,R>
}

export function doEither<L,R>(func: ()=>Either<L,R>):Either<L,R>{
    try {
        return func()
    } catch (error) {
        if(error instanceof EitherValueError){
            return Left(error.left)
        }else{
            throw error
        }
    }
}