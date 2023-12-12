// import State from './State';

class DFA_Object {

    constructor() {
        this.states = new Set();
        this.startState = null;
        this.finalStates = new Set();
    }

    setStartState(startState) {
        this.startState = startState;
    }

    getStartState() {
        return this.startState;
    }

    addFinalState(finalState) {
        this.finalStates.add(finalState);
    }

    getFinalStates() {
        return Array.from(this.finalStates);
    }

    getState(id) {
        for (const state of this.states) {
            if (state.getId() === id) { // Corrected: calling getId as a method
                return state;
            }
        }
        return null;
    }

    addState(state) {
        this.states.add(state);
        return state;
    }
    

    getStates() {
        return Array.from(this.states);
    }

    printStates() {
        console.log("DFA States:");
        this.states.forEach(state => {
            state.printStateInfo();
        });
    }

    printDFA() {
        console.log("DFA States:");
        this.states.forEach(state => {
            state.printStateInfo();
        });

        console.log(`Start State: q${this.getStartState()?.getId()}`);
        console.log("Final States:", Array.from(this.finalStates).map(state => `q${state.getId()}`));
    }

}
export default DFA_Object