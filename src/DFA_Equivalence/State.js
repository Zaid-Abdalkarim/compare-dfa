class State {
    constructor(id) {
        this.id = id;
        this.isFinal = false;
        this.isStart = false;
        this.transitions = new Map();
    }

    addTransition(symbol, nextState) {
        this.transitions.set(symbol, nextState);
    }

    getNextState(symbol) {
        return this.transitions.get(symbol);
    }

    getTransitionSymbols() {
        return Array.from(this.transitions.keys());
    }

    setStart(isStart) {
        this.isStart = isStart;
    }

    getIsStart() {
        return this.isStart;
    }

    getIsFinal() {
        return this.isFinal;
    }

    setFinal(isFinal) {
        this.isFinal = isFinal;
    }

    isStartState(dfa) {
        return this === dfa.getStartState();
    }

    getId() {
        console.log(`Getting ID for state: q${this.id}`);
        return this.id;
    }

    printStateInfo() {
        console.log(`\n** State ID: q${this.id}`);
        
        if (this.transitions.size === 0) {
            console.log("  No transitions from this state.");
        } else {
            for (const [symbol, state] of this.transitions.entries()) {
                console.log(`  On symbol '${symbol}', goes to State ID: q${state.getId()}`);
            }
        }

        if (this.isStart) {
            console.log("  ** This is a START state. **");
        }

        if (this.isFinal) {
            console.log("  ** This is a FINAL state. **");
        }
    }
}

export default State