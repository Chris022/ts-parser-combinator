class State{
    consumed: string;
    position: number;
    unconsumed: string;
    public constructor(unconsumed:string){
        this.consumed = ""
        this.position = 0
        this.unconsumed = unconsumed
    }
    getText(length:number):string{
        return this.unconsumed.substring(0,length)
    }
    consume(length:number):string{
        let consumed_text = this.unconsumed.substring(0,length)
        this.consumed += consumed_text
        this.unconsumed = this.unconsumed.substring(length)
        return consumed_text
    }
    length():number{
        return this.unconsumed.length
    }
}