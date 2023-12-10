import Transition from "./Transition"
import Transitions from "./Transitions"
class DFA {

    constructor(startState, finalStates, transitions) {
        this.startState = startState.toString();
        this.finalStates = finalStates.map(toStateNode => JSON.stringify(toStateNode));
        this.transitions = DFA.transitionsToDomain(transitions);
        this.inputAlphabet = DFA.deriveInputAlphabet(this.transitions);
        this.nonFinalStates = DFA.deriveNonFinalStates(this.transitions, this.finalStates);
    }

    getStartState(){
        return this.startState;
    }

    getFinalStates(){
        return this.finalStates;
    }

    getTransitions(){
        return this.transitions;
    }

    getInputAlphabet(){
        return this.inputAlphabet;
    }

    getNonFinalStates(){
        return this.nonFinalStates;
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
        for(var rootNode in transitions){
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
        if(onMultiInputToSameStateLength > 1){
            for(let i = 0; i < onMultiInputToSameStateLength; i++){
                const input = transitionsJsonObject[toStateNode][i];
                const toState = toStateNode;
                transitionList.push(new Transition(rootNode, toState, input));
            }
        }
        else {
            const input = transitionsJsonObject[toStateNode][0];
            const toState = toStateNode;
            transitionList.push(new Transition(rootNode, toState, input));
        }
        }
    return transitionList;
    }

}


export default DFA