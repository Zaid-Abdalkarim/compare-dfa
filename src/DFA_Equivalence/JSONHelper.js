
import DFA from './DFA';
import State from './State';

class JSONHelper {
    
    static parseJSON(jsonString) {
        const jsonObject = JSON.parse(jsonString);
        console.log('JSON OBJECT.', jsonObject);
        console.log('JSON OBJECT - Transitions.', jsonObject.transitions);

        // const dfa = new DFA(); 
        const dfa = new DFA();
        // dfa.generateBlankDFA();

        console.log('JSON parsing started.');

        //Iterate through each state in the JSON object
        for (const fromStateIdStr in jsonObject.transitions) {
            const fromStateId = parseInt(fromStateIdStr, 10);
            let fromState = dfa.getState(fromStateId);

            // If the state doesn't exist, create and add it to the DFA
            if (!fromState) {
                fromState = new State(fromStateId);
                dfa.addState(fromState);
                console.log(`Created new state: q${fromStateId}`);
            }

            // console.log('fromStateIdStr. ', fromStateIdStr);
            console.log('jsonObject.transitions[0] ', jsonObject.transitions[fromStateIdStr]);
            const transitions = jsonObject.transitions[fromStateIdStr];
            console.log('transitions ', transitions);

            // Iterate through each transition in the state
            for (const toStateIdStr in transitions) {
                console.log('toStateIdStr. ', toStateIdStr);
                const toStateId = parseInt(toStateIdStr, 10);
                let toState = dfa.getState(toStateId);

                // If the state doesn't exist, create and add it to the DFA
                if (!toState) {
                    toState = new State(toStateId);
                    dfa.addState(toState);
                    console.log(`Created new state: q${toStateId}`);
                }

                const inputs = transitions[toStateIdStr];

                // Add transitions for each input symbol
                inputs.forEach(input => {
                    const inputSymbol = input.charAt(0);
                    fromState.addTransition(inputSymbol, toState);
                    console.log(`Added transition: q${fromStateId} -> ${inputSymbol} -> q${toStateId}`);
                });
            }//end for inner loop
        } //end for outer for loop

        console.log('JSON parsing completed.');

        // Initialize Start and Final States
        dfa.setStartState(jsonObject.startState);
        console.log('DFA Start State.', dfa.getStartState());

        dfa.getState(jsonObject.startState).setStart(true);


        dfa.addFinalState(jsonObject.finalStates[0]);
        console.log('DFA Final State.', dfa.getFinalStates());

        dfa.getState(jsonObject.finalStates[0]).setFinal(true);



        return dfa;
    }//end parseJSON function
}

export default JSONHelper;
