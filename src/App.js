import { useDispatch, useSelector } from "react-redux"
import { store } from "./Redux/store"
import DfaMaker from "./TDComponents/dfaMaker"
import { setDialogOpen } from "./Redux/dfaReducer"
import * as helper from "./TDComponents/Helper"
import DFA from "./DFA_Minimization/DFA"
const App = () => {
  const styles = {
    border: {
      border: '4px solid black',
    },
    resetButton: {
      backgroundColor: 'red',
      position: 'absolute',
      top: '44%',
      left: '35%',
      width: '25%',
      zIndex: 100,
      border: 'none'
    },
    compareDFA: {
      backgroundColor: 'lightGreen',
      marginLeft: '35%',
      width: '25%',
      zIndex: 100,
      border: 'none'
    },
    bottomDFA: {
      position: "absolute",
      bottom: 0,
      border: '4px solid black',
      top: '50%',
      height: 80,
      width: '100%'
    }
  }

  const dispatch = useDispatch()

  const open = useSelector(state => state.dfa.dialogOpen)
  const compareDfaResult = useSelector(state => state.dfa.dfasMatch)

  const handleCompareClick = () => {
    const DFA_ONE = "dfaOne";
    const DFA_TWO = "dfaTwo";
    const dfaOneTransitions = helper.getAllTransitions()[DFA_ONE];
    const dfaOneStartState = helper.getStartStates()[DFA_ONE];
    const dfaOneFinalStates = helper.getFinalStates()[DFA_ONE];
    const dfaTwoTransitions = helper.getAllTransitions()[DFA_TWO];
    const dfaTwoStartState = helper.getStartStates()[DFA_TWO];
    const dfaTwoFinalStates = helper.getFinalStates()[DFA_TWO];
    //Exporting to use with a domain class for ease of use
    const dfaOneToDomainObject = new DFA(dfaOneStartState, dfaOneFinalStates, dfaOneTransitions);
    const dfaTwoToDomainObject = new DFA(dfaTwoStartState, dfaTwoFinalStates, dfaTwoTransitions);
    console.log(JSON.stringify(dfaOneToDomainObject));
    console.log(JSON.stringify(dfaTwoToDomainObject));
  };


  // Function to generateDFAJSON
  // ------------------------------------------------------------------- 

  // const fs = require('fs'); 

  const generateDFAJson = () => {
    // Retrieve DFA-related data using your functions
    const transitions = getAllTransitions();
    const numberOfStates = getNumberOfStates();
    const numberOfFinalStates = getNumberOfFinalStates();
    const finalStates = getFinalStates();
    const startStates = getStartStates();
    

    // Structure the data into the format expected by JSONHelper
    const dfaJson = {

        dfaOne: {
            transitions: transitions.dfaOne,
            numberOfStates: numberOfStates.dfaOne,
            numberOfFinalStates: numberOfFinalStates.dfaOne,
            finalStates: finalStates.dfaOne,
            startState: startStates.dfaOne
        },
        dfaTwo: {
            transitions: transitions.dfaTwo,
            numberOfStates: numberOfStates.dfaTwo,
            numberOfFinalStates: numberOfFinalStates.dfaTwo,
            finalStates: finalStates.dfaTwo,
            startState: startStates.dfaTwo
        }
    };

    // Convert to JSON string
    // return JSON.stringify(dfaJson);
    // Convert to JSON strings for dfaOne and dfaTwo
    const dfaOneJsonString = JSON.stringify(dfaJson.dfaOne, null, 2); // The 'null, 2' adds formatting for readability
    const dfaTwoJsonString = JSON.stringify(dfaJson.dfaTwo, null, 2); // The 'null, 2' adds formatting for readability

    // Return both JSON strings as elements of an array
    return [dfaOneJsonString, dfaTwoJsonString];

    // Write the JSON strings to separate files
    // fs.writeFileSync('json_folder/dfa1.json', dfaOneJsonString);
    // fs.writeFileSync('json_folder/dfa2.json', dfaTwoJsonString);

}; //end generateDFAJson funciton
  // ------------------------------------------------------------------- 

  // -------------------------------------------------------------------

  const handleCompareDFA = () => {
    const [dfaOneJsonString, dfaTwoJsonString] = generateDFAJson();
    console.log("Debugging DFA1: ",  dfaOneJsonString); 
    console.log("Debugging DFA2: ",  dfaTwoJsonString); 

    // Print the object types of dfaOneJsonString and dfaTwoJsonString
    console.log("Debugging DFA1 TYPE: ", typeof dfaOneJsonString); // Print object type of dfaOneJsonString
    console.log("Debugging DFA2 TYPE: ", typeof dfaTwoJsonString); // Print object type

    const dfaOne = JSONHelper.parseJSON(dfaOneJsonString);
    const dfaTwo = JSONHelper.parseJSON(dfaTwoJsonString);
    // const dfa = new DFA();
    // console.log("Debugging DFA_ONLY TYPE: ", typeof dfa); // Print object type

    // const dfaOne = JSONHelper.parseJSON(dfaOneJsonString);

      // Print the object types of dfaOneJsonString and dfaTwoJsonString
    console.log("Debugging DFA1 after TYPE: ", typeof dfaOne); // Print object type of dfaOneJsonString
    console.log("Debugging DFA2 after TYPE: ", typeof dfaTwo); // Print object type

    const equivalenceChecker = new EquivalenceChecker();
    const areEquivalent = equivalenceChecker.areEquivalent(dfaOne, dfaTwo);

    // // Dispatch action to update Redux store with comparison result
    dispatch(setDialogOpen({ open: true, dfasMatch: areEquivalent }));
};

  // -------------------------------------------------------------------

  return (
    <div>
      <dialog open={open} style={{backgroundColor: compareDfaResult ? "lightGreen" : "red"}}>
        <p>{compareDfaResult ? "DFA's Match" : "Dfa's Dont Match"}</p>
        <form method="dialog">
          <button onClick={() => dispatch(setDialogOpen({open: false}))}>OK</button>
        </form>
      </dialog>
      <button style={styles.compareDFA} onClick={handleCompareClick}><h3>Compare DFA's</h3></button>
      <div  style={styles.border}>
        <DfaMaker one={true}/>
      </div>
      <button style={styles.resetButton} onClick={() => {window.location.reload()}}><h3>Reset</h3></button>
      <div style={styles.bottomDFA}>
        <DfaMaker one={false}/>
      </div>
    </div>
  )
}

export default App