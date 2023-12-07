import { useDispatch, useSelector } from "react-redux"
import { store } from "./Redux/store"
import DfaMaker from "./TDComponents/dfaMaker"
import { setDialogOpen } from "./Redux/dfaReducer"
import EquivalenceChecker from './DFA_Equivalence/EquivalenceChecker'; 
import * as helper from "./TDComponents/Helper"
import DFA from "./DFA_Minimization/DFA"
import DFAReader from './DFA_Equivalence/DFAReader';


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

  const handleCompareClick_WithEquivalenceChecker= () => {

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
    console.log("Before minimization:");
    console.log(JSON.stringify(dfaOneToDomainObject));
    console.log("");
    console.log(JSON.stringify(dfaTwoToDomainObject));
    console.log("");
    console.log("After minimization:");
    const minimizedAutomatonOne = dfaOneToDomainObject.minimize();
    const minimizedAutomatonTwo = dfaTwoToDomainObject.minimize();
    console.log(JSON.stringify(minimizedAutomatonOne));
    console.log("");
    console.log(JSON.stringify(minimizedAutomatonTwo));

    let dfaReader1 = new DFAReader(minimizedAutomatonOne);
    let dfa1 = dfaReader1.createDFA();
    dfa1.printStates();
    DFAReader.printDFA(dfa1);

    let dfaReader2 = new DFAReader(minimizedAutomatonTwo);
    let dfa2 = dfaReader2.createDFA();
    dfa2.printStates();
    DFAReader.printDFA(dfa2);

    const equivalenceChecker = new EquivalenceChecker();
    const areEquivalent = equivalenceChecker.areEquivalent(dfa1, dfa2);

    // Log the result to the console
    console.log("Are the DFAs equivalent? ", areEquivalent);

    // Dispatch action to update Redux store with comparison result
    dispatch(setDialogOpen({ open: true, dfasMatch: areEquivalent }));

  };

  return (
    <div>
      <dialog open={open} style={{backgroundColor: compareDfaResult ? "lightGreen" : "red"}}>
        <p>{compareDfaResult ? "DFA's Match" : "Dfa's Dont Match"}</p>
        <form method="dialog">
          <button onClick={() => dispatch(setDialogOpen({open: false}))}>OK</button>
        </form>
      </dialog>
      <button style={styles.compareDFA} onClick={() => {
        handleCompareClick_WithEquivalenceChecker()
        }}><h3>Compare DFA's</h3></button>
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