import DFA_Object from './DFA_Object';
import State from './State';

class DFAReader {
    constructor(dfaData) {
        this.dfaData = dfaData;
    }

    createDFA() {
        const dfa = new DFA_Object();

        // Collect all unique state IDs
        const uniqueStateIds = new Set();
        uniqueStateIds.add(this.dfaData.startState);

        this.dfaData.finalStates.forEach(stateId => uniqueStateIds.add(stateId) );
        this.dfaData.transitions.transitions.forEach(transition => {
            uniqueStateIds.add(transition.fromState);
            uniqueStateIds.add(transition.toState);
        });

        console.log("Creating States with IDs:", Array.from(uniqueStateIds));

        // Create states based on unique IDs
        uniqueStateIds.forEach(stateId => {
            console.log("Creating State with ID:", stateId);
            let state = new State(stateId);
            console.log("Created State is:", state);
            dfa.addState(state);
            dfa.printDFA();
        });

        // Set start state
        let startState = dfa.getState(this.dfaData.startState);
        if (startState) {
            console.log("Setting Start State:", this.dfaData.startState);
            startState.setStart(true);
            dfa.setStartState(startState);
            dfa.printDFA();
        }

        // Set final states
        this.dfaData.finalStates.forEach(stateId => {
            let finalState = dfa.getState(stateId);
            if (finalState) {
                console.log("Setting Final State:", stateId);
                finalState.setFinal(true);
                dfa.addFinalState(finalState);
                dfa.printDFA();
            }
        });

        // Add transitions
        this.dfaData.transitions.transitions.forEach(transition => {
            let fromState = dfa.getState(transition.fromState);
            let toState = dfa.getState(transition.toState);
            if (fromState && toState) {
                fromState.addTransition(transition.onInput, toState);
            }
        });

        return dfa;
    }

    static printDFA(dfa) {
        console.log("---------------- Printing DFA Structure: ----------------");
        console.log(`Start State: q${dfa.getStartState()?.getId()}`);
        console.log("Final States:", dfa.getFinalStates().map(state => `q${state.getId()}`));

        console.log("---------------- All States in DFA Structure: ----------------");
        dfa.getStates().forEach(state => {
            console.log(`\nState ID: q${state.getId()}`);
            console.log(`Is Start State: ${state.getIsStart()}`);
            console.log(`Is Final State: ${state.getIsFinal()}`);
            console.log("Transitions:");
            state.getTransitionSymbols().forEach(symbol => {
                let nextState = state.getNextState(symbol);
                console.log(`  On symbol '${symbol}', goes to State ID: q${nextState?.getId()}`);
            });
        });
        console.log("---------------- Ending DFA Structure: ----------------");
    }

}//end DFAReader class 

export default DFAReader
