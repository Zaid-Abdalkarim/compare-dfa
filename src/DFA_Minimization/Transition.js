class Transition {
    constructor(fromState, toState, onInput) {
        this.fromState = fromState;
        this.toState = toState;
        this.onInput = onInput;
    }

    getInput(){
        return this.onInput;
    }
}
export default Transition