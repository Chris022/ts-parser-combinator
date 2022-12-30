"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = void 0;
class State {
    constructor(unconsumed) {
        this.consumed = "";
        this.position = 0;
        this.unconsumed = unconsumed;
    }
    getText(length) {
        return this.unconsumed.substring(0, length);
    }
    consume(length) {
        this.position += length;
        let consumed_text = this.unconsumed.substring(0, length);
        this.consumed += consumed_text;
        this.unconsumed = this.unconsumed.substring(length);
        return consumed_text;
    }
    length() {
        return this.unconsumed.length;
    }
    clone() {
        let state = new State(this.unconsumed);
        state.consumed = this.consumed;
        state.position = this.position;
        return state;
    }
}
exports.State = State;
