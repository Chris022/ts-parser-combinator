export interface HOK {
    readonly _A?: unknown

    readonly type?: unknown
}

export type Kind<F extends HOK, A> = 
    (F & {
        readonly _A: A
    })["type"]