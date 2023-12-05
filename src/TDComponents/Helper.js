import { setDialogOpen } from "../Redux/dfaReducer"
import { store } from "../Redux/store"

export const getAllTransitions = () => {
  const transitionOne = store.getState().dfa.transitionsOne
  const transitionTwo = store.getState().dfa.transitionsTwo
  
  const transitions = {
    dfaOne: transitionOne,
    dfaTwo: transitionTwo
  }
  return transitions
}

export const getNumberOfStates = () => {
  const statesOne = store.getState().dfa.numberStatesOne
  const statesTwo = store.getState().dfa.numberStatesTwo

  return {dfaOne: statesOne, dfaTwo: statesTwo}
}

export const getNumberOfFinalStates = () => {
  const finalStateOne = store.getState().dfa.numberFinalStateOne
  const finalStateTwo = store.getState().dfa.numberFinalStateTwo

  return {dfaOne: finalStateOne, dfaTwo: finalStateTwo}
}

export const getFinalStates = () => {
  const finalStateOne = store.getState().dfa.finalStatesOne
  const finalStateTwo = store.getState().dfa.finalStatesTwo

  return {dfaOne: finalStateOne, dfaTwo: finalStateTwo}
}

export const getStartStates = () => {
  const startStateOne = store.getState().dfa.numberStartStateOne
  const startStateTow = store.getState().dfa.numberStartStateTwo

  return {dfaOne: startStateOne, dfaTwo: startStateTow}
}

export const showDfasMatchDialog = (dfasMatch) => {
  store.dispatch(setDialogOpen({open: true, dfasMatch: dfasMatch}))
} 