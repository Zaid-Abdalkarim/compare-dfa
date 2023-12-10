class Transition {
    constructor(fromState, toState, onInput) {
        this.fromState = fromState;
        this.toState = toState;
        this.onInput = onInput;
    }
    getFromState(){
        return this.fromState;
    }
    getToState(){
        return this.toState;
    }
    getInput(){
        return this.onInput;
    }
}
export default Transition