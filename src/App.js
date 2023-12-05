import { useDispatch, useSelector } from "react-redux"
import { store } from "./Redux/store"
import DfaMaker from "./TDComponents/dfaMaker"
import { setDialogOpen } from "./Redux/dfaReducer"
import { showDfasMatchDialog } from "./TDComponents/Helper"
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
    },
    compareDFA: {
      backgroundColor: 'lightGreen',
      marginLeft: '35%',
      width: '25%',
      zIndex: 100,
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

  return (
    <div>
      <dialog open={open} style={{backgroundColor: compareDfaResult ? "lightGreen" : "red"}}>
        <p>{compareDfaResult ? "DFA's Match" : "Dfa's Dont Match"}</p>
        <form method="dialog">
          <button onClick={() => dispatch(setDialogOpen({open: false}))}>OK</button>
        </form>
      </dialog>
      <button style={styles.compareDFA} onClick={() => {/* YOUR CODE HERE */}}><h3>Compare DFA's</h3></button>
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