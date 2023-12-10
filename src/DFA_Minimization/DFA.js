import Transition from "./Transition"
class DFA {

    constructor(startState, finalStates, transitions) {
        this.startState = startState.toString();
        this.finalStates = finalStates.map(state => JSON.stringify(state));
        this.transitions = DFA.transitionsToDomain(transitions);
        this.inputAlphabet = DFA.deriveInputAlphabet(this.transitions);
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

    static deriveInputAlphabet(transitions) {
        const sigma = new Set();
        transitions.forEach((transition) => sigma.add(transition.getInput()));
        return Array.from(sigma);
    }

    static transitionsToDomain(transitions) {
        const result = []
        for(var rootNode in transitions){
            const innerProperties = DFA.deserialize(transitions[rootNode]);
            const transition = new Transition(rootNode,innerProperties[0], innerProperties[1]);
            result.push(transition);
        }
        return result;
    }

    //Hacky way to get this into a reasonable simple object to operate on
    //this data schema :) 
    static deserialize(jsonObj) {
    let input = "";
    let toState = "";
    for (var data in jsonObj) {
        input = jsonObj[data][0];
        toState = data;
    }
    return [toState, input];
    }

}


export default DFA