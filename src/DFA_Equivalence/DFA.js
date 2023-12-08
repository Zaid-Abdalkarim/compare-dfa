

class DFA {

    constructor() {
        this.states = new Set();
        this.startState = null;
        this.finalStates = new Set();
    }

    generateBlankDFA() {
        // Create a new blank DFA with no states or transitions
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
            if (state.getId() === id) {
                return state;
            }
        }
        return null; // or throw an exception if a state is not found
    }

    addState(state) {
        this.states.add(state);
    }

    getStates() {
        return Array.from(this.states);
    }
}
export default DFA