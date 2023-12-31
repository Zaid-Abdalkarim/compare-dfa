import State from './State';

class EquivalenceChecker {
    constructor() {
        this.visited = new Set();
    }

    areEquivalent(dfa1, dfa2) {
        let visitedDFA1 = new Set();
        let visitedDFA2 = new Set();

        const startState1 = dfa1.getStartState();
        const startState2 = dfa2.getStartState();
        
        console.log('DFA1 Start State:', startState1 instanceof State ? 'State' : 'Not State');
        console.log('DFA2 Start State:', startState2 instanceof State ? 'State' : 'Not State');
    
        console.log('DFA1 Final State:', dfa1.getFinalStates());
        console.log('DFA2 Final State:', dfa2.getFinalStates());

        return this.areStatesEquivalent(dfa1.getStartState(), dfa2.getStartState(), visitedDFA1, visitedDFA2);
    }

    areStatesEquivalent(startState1, startState2, visitedDFA1, visitedDFA2) {
        console.log(`Comparing states: q${startState1.id} and q${startState2.id}`);
        let queue = [];
        let stateAssociations = new Map();

        queue.push([startState1, startState2]);

        while (queue.length > 0) {
            let [state1, state2] = queue.shift();

            console.log('Comparing states:');
            if (state1) console.log(`DFA1 State q${state1.getId()}`);
            if (state2) console.log(`DFA2 State q${state2.getId()}`);

            if ((state1 === null || state2 === null) && state1 !== state2) return false;
            if (state1 && state2 && state1.isFinal !== state2.isFinal) return false;
            if (visitedDFA1.has(state1.getId()) && visitedDFA2.has(state2.getId())) continue;

            visitedDFA1.add(state1.getId());
            visitedDFA2.add(state2.getId());

            for (let symbol of this.getAllSymbols(state1, state2)) {
                let nextState1 = state1.getNextState(symbol);
                let nextState2 = state2.getNextState(symbol);

                // Print the current transition being checked
                console.log(`Checking transition for symbol '${symbol}':`);
                console.log(`DFA1: State q${state1.id} transitions to ${nextState1 ? 'q' + nextState1.id : 'null'} on symbol '${symbol}'`);
                console.log(`DFA2: State q${state2.id} transitions to ${nextState2 ? 'q' + nextState2.id : 'null'} on symbol '${symbol}'`);


                console.log(`DFA1: Comparing transitions: q${state1.getId()} --[${symbol}]--> q${nextState1 ? nextState1.getId() : "null"} with DFA2: q${state2.getId()} --[${symbol}]--> q${nextState2 ? nextState2.getId() : "null"}`);

                let nextStatePair = [nextState1 ? nextState1.getId() : null, nextState2 ? nextState2.getId() : null];
                if (nextState1 && nextState2) {
                    let conflictingAssociation = Array.from(stateAssociations.keys()).some(key =>
                        (key[0] === nextState1.getId() && key[1] !== nextState2.getId()) ||
                        (key[1] === nextState1.getId() && key[0] !== nextState2.getId())
                    );

                    if (conflictingAssociation) {
                        this.printStateDiscrepancy(state1, state2, stateAssociations, nextState1, nextState2);
                        return false;
                    }

                    // Log the association being formed
                    console.log(`Forming association: DFA1 State q${nextState1.getId()} and DFA2 State q${nextState2.getId()} on symbol '${symbol}'`);

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
        let discrepancyInfo = "";
        console.log("State discrepancy found:");
        console.log(`State1: ${state1 ? `q${state1.getId()}` : "null"}`);
        console.log(`State2: ${state2 ? `q${state2.getId()}` : "null"}`);
        if (conflictingState1 && conflictingState2) {
            console.log(`Conflict: Trying to associate DFA1 State q${conflictingState1.getId()} with DFA2 State q${conflictingState2.getId()}, which conflicts with existing associations.`);
            discrepancyInfo = `Reasoning behind Conflict: Trying to associate DFA1 State q${conflictingState1.getId()} with DFA2 State q${conflictingState2.getId()}, which conflicts with existing associations.\n`;

            // // Creating a string representation of the conflicting pair, similar to Java's Pair
            // let conflictingPair = `q${conflictingState1.getId()}-q${conflictingState2.getId()}`;
            // if (stateAssociations.has(conflictingPair)) {
            //     console.log(`Existing association for this pair: ${stateAssociations.get(conflictingPair)}`);
            // } else {
            //     console.log("No existing associations found for this pair.");
            // }
            
            // Check for existing associations for each conflicting state
            let existingAssociation1 = this.findAssociationForState(conflictingState1, stateAssociations);
            let existingAssociation2 = this.findAssociationForState(conflictingState2, stateAssociations);


            if (existingAssociation1) {
                let formattedAssociation = existingAssociation1[0].map(id => `q${id}`).join(',');
                console.log(`Existing association found for DFA1 State q${conflictingState1.getId()}: ${formattedAssociation}, ${existingAssociation1[1]}`);
                discrepancyInfo += `Existing association found for DFA1 State q${conflictingState1.getId()}: ${formattedAssociation}, ${existingAssociation1[1]}\n`;

            } else {
                console.log(`No existing associations found for DFA1 State q${conflictingState1.getId()}`);
            }
            
            if (existingAssociation2) {
                let formattedAssociation = existingAssociation2[0].map(id => `q${id}`).join(',');
                console.log(`Existing association found for DFA2 State q${conflictingState2.getId()}: ${formattedAssociation}, ${existingAssociation2[1]}`);
                discrepancyInfo += `Existing association found for DFA1 State q${conflictingState1.getId()}: ${formattedAssociation}, ${existingAssociation1[1]}\n`;

            } else {
                console.log(`No existing associations found for DFA2 State q${conflictingState2.getId()}`);
            }
        }

        console.log(discrepancyInfo);
        this.printStateAssociations(stateAssociations);
    }//end printStateDiscrepancy

    // Helper method to find association for a given state
    findAssociationForState(state, stateAssociations) {
        //console.log("Debug: Searching for associations for state:", `q${state.getId()}`);
    
        for (let association of stateAssociations) {
            //console.log("Debug: Current association being checked:", association);
    
            // Assuming the first element of the association array contains state IDs
            let states = association[0];
            if (states.includes(state.getId().toString())) {
                //console.log("Debug: Matching association found:", association);
                return association;
            }
        }
    
        //console.log("Debug: No association found for state:", `q${state.getId()}`);
        return null;
    }

    getAllSymbols(state1, state2) {
        console.log(`Getting symbols for states: q${state1.getId()} and q${state2.getId()}`);

        // let symbols1 = state1.getTransitionSymbols();  // Assuming these are methods returning Sets or Arrays
        // let symbols2 = state2.getTransitionSymbols();

        // console.log(`Symbols for q${state1.getId()}: [${[...symbols1].join(", ")}]`);
        // console.log(`Symbols for q${state2.getId()}: [${[...symbols2].join(", ")}]`);

        
        let symbols = new Set([...state1.getTransitionSymbols(), ...state2.getTransitionSymbols()]);
        
        console.log(`Symbols for q${state1.getId()}: [${[...state1.getTransitionSymbols()].join(", ")}]`);
        console.log(`Symbols for q${state2.getId()}: [${[...state2.getTransitionSymbols()].join(", ")}]`);
        
        return symbols
    }

    
}

export default EquivalenceChecker;
