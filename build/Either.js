"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doEither = exports.Right = exports.Left = void 0;
class EitherValueError extends Error {
    constructor(left) {
        super("EitherValueError");
        this.left = left;
    }
}
class EitherClass {
    constructor(error, value) {
        this.error = error;
        this.value = value;
    }
    get() {
        if (!this.error)
            return this.value;
        if (this.error)
            throw new EitherValueError(this.value);
        throw new Error("Something weird happend in the Either class");
    }
    isLeft() {
        return this.error ? true : false;
    }
    isRight() {
        return !this.error ? true : false;
    }
}
function Left(value) {
    return new EitherClass(true, value);
}
exports.Left = Left;
function Right(value) {
    return new EitherClass(false, value);
}
exports.Right = Right;
function doEither(func) {
    try {
        return func();
    }
    catch (error) {
        if (error instanceof EitherValueError) {
            return Left(error.left);
        }
        else {
            throw error;
        }
    }
}
exports.doEither = doEither;
