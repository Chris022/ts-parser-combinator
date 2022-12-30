export type Either<L, R> = EitherClass<L, R>;
declare class EitherClass<L, R> {
    error: boolean;
    value: L | R;
    constructor(error: boolean, value: L | R);
    get(): R;
    isLeft(): boolean;
    isRight(): boolean;
}
export declare function Left<L, R>(value: L): Either<L, R>;
export declare function Right<L, R>(value: R): Either<L, R>;
export declare function doEither<L, R>(func: () => Either<L, R>): Either<L, R>;
export {};
