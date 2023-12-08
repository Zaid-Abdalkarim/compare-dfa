// import DFA from './DFA_Equivalence/DFA'; 
// import State from './DFA_Equivalence/State'; 
// import JSONHelper from './DFA_Equivalence/JSONHelper'; 

class EquivalenceChecker {
    constructor() {
        this.visited = new Set();
    }

    areEquivalent(dfa1, dfa2) {
        let visitedDFA1 = new Set();
        let visitedDFA2 = new Set();
        console.log('DFA1 Start State.', dfa1.getStartState());
        console.log('DFA2 Start State.', dfa2.getStartState());

        console.log('DFA1 Final State.', dfa1.getFinalStates());
        console.log('DFA2 Final State.', dfa2.getFinalStates());
        return this.areStatesEquivalent(dfa1.getStartState(), dfa2.getStartState(), visitedDFA1, visitedDFA2);
    }

    areStatesEquivalent(startState1, startState2, visitedDFA1, visitedDFA2) {
        let queue = [];
        let stateAssociations = new Map();

        queue.push([startState1, startState2]);

        while (queue.length > 0) {
            let [state1, state2] = queue.shift();

            if (state1) state1.printStateInfo();
            if (state2) state2.printStateInfo();

            if ((state1 === null || state2 === null) && state1 !== state2) return false;
            if (state1 && state2 && state1.isFinal() !== state2.isFinal()) return false;
            if (visitedDFA1.has(state1.getId()) && visitedDFA2.has(state2.getId())) continue;

            visitedDFA1.add(state1.getId());
            visitedDFA2.add(state2.getId());

            for (let symbol of this.getAllSymbols(state1, state2)) {
                let nextState1 = state1.getNextState(symbol);
                let nextState2 = state2.getNextState(symbol);

                console.log(`DFA1: Comparing transitions: q${state1.getId()} --[${symbol}]--> q${nextState1 ? nextState1.getId() : "null"} with DFA2: q${state2.getId()} --[${symbol}]--> q${nextState2 ? nextState2.getId() : "null"}`);

                let nextStatePair = [nextState1.getId(), nextState2.getId()];
                if (nextState1 && nextState2) {
                    let conflictingAssociation = Array.from(stateAssociations.keys()).some(key =>
                        (key[0] === nextState1.getId() && key[1] !== nextState2.getId()) ||
                        (key[1] === nextState1.getId() && key[0] !== nextState2.getId())
                    );

                    if (conflictingAssociation) {
                        this.printStateDiscrepancy(state1, state2, stateAssociations, nextState1, nextState2);
                        return false;
                    }

                    stateAssociations.set(nextStatePair, true);

                    if (!visitedDFA1.has(nextState1.getId()) && !visitedDFA2.has(nextState2.getId())) {
                        queue.push([nextState1, nextState2]);
                    }
                }
            }
        }
        this.printStateAssociations(stateAssociations);
        return true;
    }

    printStateAssociations(stateAssociations) {
        console.log("State Associations:");
        stateAssociations.forEach((value, key) => {
            console.log(`DFA1 State q${key[0]} is associated with DFA2 State q${key[1]}`);
        });
    }

    printStateDiscrepancy(state1, state2, stateAssociations, conflictingState1, conflictingState2) {
        console.log("State discrepancy found:");
        console.log(`State1: ${state1 ? `q${state1.getId()}` : "null"}`);
        console.log(`State2: ${state2 ? `q${state2.getId()}` : "null"}`);
        if (conflictingState1 && conflictingState2) {
            console.log(`Conflict: Trying to associate DFA1 State q${conflictingState1.getId()} with DFA2 State q${conflictingState2.getId()}, which conflicts with existing associations.`);
            let conflictingPair = [conflictingState1.getId(), conflictingState2.getId()];
            if (stateAssociations.has(conflictingPair)) {
                console.log(`Existing association for this pair: ${stateAssociations.get(conflictingPair)}`);
            } else {
                console.log("No existing associations found for this pair.");
            }
        }
        this.printStateAssociations(stateAssociations);
    }

    getAllSymbols(state1, state2) {
        let symbols = new Set([...state1.getTransitionSymbols(), ...state2.getTransitionSymbols()]);
        return symbols;
    }
}
export default EquivalenceChecker