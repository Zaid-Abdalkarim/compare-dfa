import { createSlice } from '@reduxjs/toolkit'

export const dfaReducer = createSlice({
  name: 'dfa',
  initialState: {
    numberStartStateOne: 0,
    numberStartStateTwo: 0,

    numberFinalStateOne: 0,
    numberFinalStateTwo: 0,

    numberStatesOne: 0,
    numberStatesTwo: 0,

    transitionsOne: {},
    transitionsTwo: {},

    finalStatesOne: [],
    finalStatesTwo: []
  },
  reducers: {
    setNumberOfStartStates: (state, action) => {
      if (action.payload.one) {
        state.numberStartStateOne = action.payload.count
      } else {
        state.numberStartStateTwo = action.payload.count
      }
    },
    setNumberOfFinalStates: (state, action) => {
      if (action.payload.one) {
        state.numberFinalStateOne = action.payload.count
      } else {
        state.numberFinalStateTwo = action.payload.count
      }    
    },
    setNumberOfStates: (state, action) => {
      if (action.payload.one) {
        state.numberStatesOne = action.payload.count
      } else {
        state.numberStatesTwo = action.payload.count
      }
    },
    setTransitions: (state, action) => {
      if (action.payload.one) {
        state.transitionsOne = action.payload.transitions
      } else {
        state.transitionsTwo = action.payload.transitions
      }
    },
    setFinalStates: (state, action) => {
      if (action.payload.one) {
        state.finalStatesOne = action.payload.finalStates
      } else {
        state.finalStatesTwo = action.payload.finalStates
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { setNumberOfStartStates, setNumberOfFinalStates, setNumberOfStates, setTransitions, setFinalStates } = dfaReducer.actions

export default dfaReducer.reducer