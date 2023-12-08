import Transition from "./Transition";
import Transitions from "./Transitions";

class DFA {

    constructor(startState = "", finalStates = [], transitions = []) {
        this.startState = startState.toString();
        this.finalStates = finalStates.map(toStateNode => JSON.stringify(toStateNode));
        this.transitions = DFA.transitionsToDomain(transitions);
        this.inputAlphabet = DFA.deriveInputAlphabet(this.transitions);
        this.nonFinalStates = DFA.deriveNonFinalStates(this.transitions, this.finalStates);
    }

    getStartState() {
        return this.startState;
    }

    getFinalStates() {
        return this.finalStates;
    }

    getTransitions() {
        return this.transitions;
    }

    getInputAlphabet() {
        return this.inputAlphabet;
    }

    getNonFinalStates() {
        return this.nonFinalStates;
    }

    getAllStates() {
        return this.finalStates.concat(this.nonFinalStates);
    }

    setNewInputAlphabet(inputAlphabet) {
        this.inputAlphabet = inputAlphabet;
    }

    setinputAlphabet(transitions) {
        this.inputAlphabet = DFA.deriveInputAlphabet(transitions);
    }

    setNonFinalStates(transitions, finalStates) {
        this.nonFinalStates = DFA.deriveNonFinalStates(transitions, finalStates);
    }
    setNonFinalStates(nonFinalStates) {
        this.nonFinalStates = nonFinalStates;
    }

    setStartState(startState) {
        this.startState = startState;
    }

    setFinalStates(finalStates) {
        this.finalStates = finalStates;
    }

    setNonFinalStates(nonFinalStates) {
        this.nonFinalStates = nonFinalStates;
    }

    setTransitions(transitions) {
        this.transitions = transitions;
    }

    updateFinalStates(finalStates) {
        if (this.finalStates == null) {
            this.finalStates = finalStates;
        }
        this.finalStates.push(finalStates);
    }

    updateNonFinalStates(states, transitions) {
        const from = new Set();
        const to = new Set();
        let newStates = this.getNonFinalStates();
        if (newStates == null || newStates.length == 0) {
            return [];
        }
        for (const state of states) {
            if (newStates.includes(state)) {
                newStates = newStates.filter(item => item !== state);
            }
        }

        transitions.getTransitions().forEach(element => {
            from.add(element.getFromState());
            to.add(element.getToState());
        })

        const union = new Set([...from,...to]);
        const toRemove = new Set();
        for(const state of newStates){
            if(!union.has(state)){
                toRemove.add(state);
            }
        }
        for(const item of toRemove){
            newStates = newStates.filter(item => item !== item);
        }
        return this.setNonFinalStates(newStates);
    }

    addTransition(transition) {
        this.transitions.getTransitions().push(transition);
    }


    minimize() {
        // Step 1: Remove unreachable states
        const newDFA = this.removeUnreachableStates();

        // Step 2: Draw transition table for all pairs of states
        const transitionTable = this.constructTransitionTable(newDFA);

        //Step 3: Split the transition table into fromNonFinalStateGroup and fromFinalStateGroup
        let fromNonFinalStateGroup = transitionTable.filter(row => !newDFA.getFinalStates().includes(row.fromState));
        let fromFinalStateGroup = transitionTable.filter(row => newDFA.getFinalStates().includes(row.fromState));

        // Step 4: Find similar rows in fromNonFinalStateGroup
        this.removeSimilarRowsRepeatedly(fromNonFinalStateGroup);

        //Step 5: Repeat until no similar rows in fromFinalStateGroup
        this.removeSimilarRowsRepeatedly(fromFinalStateGroup);

        // Step 6: Combine reduced fromNonFinalStateGroup and fromFinalStateGroup
        let mergedGroup = fromNonFinalStateGroup.concat(fromFinalStateGroup);
        // Step 7: Basically if the groups transition to the same states outside of the group
        this.removeSimilarRowsRepeatedly(mergedGroup);

        let existingFinal = this.toState(this.tableToDomainFormatTransitions(fromFinalStateGroup));
        let merged = this.toState(this.tableToDomainFormatTransitions(mergedGroup));
        newDFA.setFinalStates(fromFinalStateGroup.length + fromNonFinalStateGroup.length == mergedGroup.length 
            ? existingFinal
            : merged);
        newDFA.updateNonFinalStates(newDFA.getFinalStates(), this.tableToDomainFormatTransitions(mergedGroup));

        // step 8: build minimum DFA
        const minimizedDFA = this.constructMinimizedDFA(newDFA, mergedGroup);

        return minimizedDFA;
    }

    tableToDomainFormatTransitions(table) {
        const minimizedTransitions = [];
        table.forEach(row => {
            const fromState = row.fromState;
            const inputAlphabet = Object.keys(row).filter(key => key !== 'fromState');

            for (const inputSymbol of inputAlphabet) {
                const toState = row[inputSymbol].toState[0];
                minimizedTransitions.push(new Transition(fromState, toState, inputSymbol));
            }
        });
        return new Transitions(minimizedTransitions);
    }

    toState(transitions) {
        const setOfStates = new Set();
        transitions.getTransitions().forEach(transition => setOfStates.add(transition.getFromState()));
        return [...setOfStates];
    }

    removeUnreachableStates() {
        const dfaWithRemovedStates = new DFA();
        // Perform DFS traversal to mark reachable states
        const markedStates = new Set();
        const stack = [this.getStartState()];

        while (stack.length > 0) {
            const currentState = stack.pop();

            if (!markedStates.has(currentState)) {
                markedStates.add(currentState);

                // Add next states to the stack
                const nextStates = this.fromStateTransitions(currentState)
                    .map(transition => transition.getToState());
                stack.push(...nextStates);
            }
        }

        // Filter out states that are not marked
        const reachableStates = Array.from(markedStates);
        const unreachableStates = this.getAllStates().filter(state => !reachableStates.includes(state));

        // Update transitions, final states, and non-final states
        dfaWithRemovedStates.setTransitions(this.transitions.getTransitions()
            .filter(transition => reachableStates.includes(transition.getFromState()) && reachableStates.includes(transition.getToState())));

        dfaWithRemovedStates.setFinalStates(this.finalStates.filter(state => reachableStates.includes(state)));
        dfaWithRemovedStates.setNonFinalStates(this.nonFinalStates.filter(state => reachableStates.includes(state)));

        // Update the start state if it is unreachable
        if (!reachableStates.includes(this.getStartState())) {
            dfaWithRemovedStates.setStartState(reachableStates[0]); // Set a reachable state as the new start state
        } else {
            dfaWithRemovedStates.setStartState(this.getStartState());
        }
        dfaWithRemovedStates.setinputAlphabet(dfaWithRemovedStates);
        return dfaWithRemovedStates;
    }

    constructTransitionTable(newDFA) {
        const inputAlphabet = newDFA.getInputAlphabet();
        const transitionTable = [];

        newDFA.getAllStates().forEach(fromState => {
            const row = {
                fromState: fromState,
            };

            inputAlphabet.forEach(input => {
                const transitions = newDFA.getTransitions()
                    .filter(transition => transition.getFromState() === fromState && transition.getInput() === input);

                if (transitions.length > 0) {
                    row[input] = {
                        toState: transitions.map(transition => transition.getToState()),
                        inputAlphabet: input,
                    };
                } else {
                    row[input] = "-";
                }
            });

            transitionTable.push(row);
        });

        return transitionTable;
    }

    removeSimilarRowsRepeatedly(table) {
        let removed = true;

        while (removed) {
            const indicesToRemove = this.findSimilarRows(table);

            if (indicesToRemove.length > 0) {
                indicesToRemove.reverse().forEach(index => table.splice(index, 1));
            } else {
                removed = false;
            }
        }
    }

    findSimilarRows(table) {
        const rowIndicesToRemove = [];

        for (let i = 0; i < table.length; i++) {
            for (let j = i + 1; j < table.length; j++) {
                if (this.areRowsSimilar(table[i], table[j])) {
                    rowIndicesToRemove.push(j);
                }
            }
        }

        return rowIndicesToRemove;
    }

    areRowsSimilar(row1, row2) {
        const inputAlphabet = Object.keys(row1).filter(key => key !== 'fromState');
        // Compare fromState
        const fromState1 = row1.fromState;
        const fromState2 = row2.fromState;

        /*if (fromState1 !== fromState2) {
            return false;
        }*/

        // Compare toStates for each input in the alphabet
        for (const inputSymbol of inputAlphabet) {
            const toState1 = row1[inputSymbol];
            const toState2 = row2[inputSymbol];

            if (toState1.toState[0] !== toState2.toState[0]) {
                return false;
            }
        }

        for (const inputSymbol of inputAlphabet) {
            row1[inputSymbol].toState[0] = fromState1;
        }

        return true;
    }

    constructMinimizedDFA(currentDFA, reducedTransitionTable) {
        const minimizedDFA = new DFA();

        const minimizedTransitions = minimizedDFA.tableToDomainFormatTransitions(reducedTransitionTable);

        // Update the transitions of the minimized DFA
        minimizedDFA.setTransitions(minimizedTransitions);

        // Update final and non-final states of the minimized DFA
        const minimizedFinalStates = currentDFA.getFinalStates();

        const minimizedNonFinalStates = currentDFA.getNonFinalStates();

        minimizedDFA.setFinalStates(minimizedFinalStates);
        minimizedDFA.setNonFinalStates(minimizedNonFinalStates);

        // Update start state of the minimized DFA
        const minimizedStartState = minimizedNonFinalStates.includes(minimizedDFA.getStartState()) ?
            minimizedDFA.getStartState() :
            minimizedNonFinalStates[0];

        minimizedDFA.setStartState(minimizedStartState == undefined ?
            minimizedDFA.getFinalStates()[0] :
            minimizedStartState);
        minimizedDFA.setNewInputAlphabet(currentDFA.getInputAlphabet());
        return minimizedDFA;
    }

    findMatchingInput(row, inputAlphabet) {
        for (const inputSymbol of inputAlphabet) {
            if (row[inputSymbol] === row[inputAlphabet[0]]) {
                return inputSymbol;
            }
        }

        // Return the first input symbol if no match is found
        return inputAlphabet[0];
    }

    fromStateTransitions(fromState) {
        return this.transitions.getTransitions()
            .filter(state => state.getFromState() == fromState);
    }

    static deriveNonFinalStates(transitions, finalStates) {
        const nonFinalStates = new Set();
        transitions.getTransitions().forEach((transition) => {
            nonFinalStates.add(transition.getFromState());
            nonFinalStates.add(transition.getToState());
        });
        finalStates.forEach((finalState) => nonFinalStates.delete(finalState));
        return Array.from(nonFinalStates);
    }

    static deriveInputAlphabet(transitions) {
        const sigma = new Set();
        transitions.getTransitions().forEach((transition) => sigma.add(transition.getInput()));
        return Array.from(sigma);
    }

    static transitionsToDomain(transitions) {
        const result = []
        for (var rootNode in transitions) {
            const transitionsList = DFA.deserialize(rootNode, transitions[rootNode]);
            transitionsList.forEach((transition) => result.push(transition));
        }
        return new Transitions(result);
    }

    //Hacky way to get this into a reasonable simple object to operate on this data schema :) 
    static deserialize(rootNode, transitionsJsonObject) {
        const transitionList = [];
        for (var toStateNode in transitionsJsonObject) {
            const onMultiInputToSameStateLength = transitionsJsonObject[toStateNode].length;
            if (onMultiInputToSameStateLength > 1) {
                for (let i = 0; i < onMultiInputToSameStateLength; i++) {
                    const input = transitionsJsonObject[toStateNode][i];
                    const toState = toStateNode;
                    transitionList.push(new Transition(rootNode, toState, input));
                }
            } else {
                const input = transitionsJsonObject[toStateNode][0];
                const toState = toStateNode;
                transitionList.push(new Transition(rootNode, toState, input));
            }
        }
        return transitionList;
    }
}

export default DFA;