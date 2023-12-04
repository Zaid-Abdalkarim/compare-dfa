import React, { useState } from 'react';

import 'reactflow/dist/style.css';

import Sidebar from './Sidebar';

import { NodeTypes } from './NodeTypes';
import DraggableCircle from './DraggableCircle';
import Xarrow, {useXarrow, Xwrapper} from 'react-xarrows';
import { setFinalStates, setNumberOfFinalStates, setNumberOfStartStates, setNumberOfStates, setTransitions } from '../Redux/dfaReducer';
import { useDispatch } from 'react-redux';

const DfaMaker = (props) => {
  const [circles, setCircles] = useState([])
  const [arrows, setArrows] = useState({})
  const [tempArrow, setTempArrow] = useState(null)
  const [emptyX, setEmptyX] = useState(0)
  const [emptyY, setEmptyY] = useState(0)
  const [localFinalStates, setLocalFinalStates] = useState([])
  const [localTransitions, setLocalTransitions] = useState({})
  const [numberOfLocalFinalStates, setNumberOfLocalFinalStates] = useState(0)
  const [startStates, setStartStates] = useState(0)
  const updateXarrrow = useXarrow()

  const dispatch = useDispatch()
  
  const styles = {
    sidebar: {
      border: '4px solid black',
      width: 100
    }
  }


  const createArrow = (event, fromNode) => {
    const arrow = React.createElement(Xarrow, {
      start: `state-${fromNode}`,
      end: "empty-drag",
    })
    setTempArrow(arrow)
  }


  const updateTransition = (fromNode, toNode, newValue) => {
    console.log(newValue)
    let tempTransitions = localTransitions
    const splitValues = newValue.split(',')
    if (!localTransitions[fromNode]) {
      tempTransitions[fromNode] = {}
    }
    if (!tempTransitions[fromNode][toNode]) {
      tempTransitions[fromNode][toNode] = []
    }
    tempTransitions[fromNode][toNode] = splitValues
    setLocalTransitions({...localTransitions, ...tempTransitions})
    
    const payload = {
      one: props?.one,
      transitions: {...localTransitions, ...tempTransitions}
    }
    dispatch(setTransitions(payload))
  }

  const setArrow = (event, fromNode) => {
    const elem = document.elementsFromPoint(event.clientX, event.clientY)
    let stateIndex = -1
    for(var i in Object.entries(elem)) {
      if (elem[i]?.id.includes('state-')) {
        stateIndex = i
      }
    }
    if(stateIndex === -1) {
      setTempArrow(null)
      return
    }

    const arrow = React.createElement(Xarrow, {
      start: `state-${fromNode}`,
      end: elem[stateIndex]?.id,
      id: `arrow-${fromNode}`,
      curvness: `state-${fromNode}` === elem[stateIndex]?.id ? 2 : Math.random() * 2,
      labels:{ middle: <input style={{width: 25}} onChange={(value) => updateTransition(fromNode, elem[stateIndex]?.id.split('-')[1], value.target.value)}></input> }
    })
    setTempArrow(null)
    const arrowsObject = arrows
    arrowsObject[`arrow-${fromNode}-${elem[stateIndex]?.id}`] = arrow

    setArrows(arrowsObject)
  }

  const innerDetails = (text) => {
    return (
      <h3 style={{textAlign: 'center'}}>{text}</h3>
    )
  }

  const emptyDrag = (e) => {
    if(e.clientX !== 0. ) {
      setEmptyX(e.clientX)
      setEmptyY(e.clientY)
      updateXarrrow(e)
    }
  }

  const onDrag = (event, nodeType) => {

    if (nodeType === 'FINAL') {
      if (startStates === 0) {
        return
      }
      setNumberOfLocalFinalStates(numberOfLocalFinalStates + 1)
      const payload = {
        one: props?.one,
        count: numberOfLocalFinalStates + 1
      }
      dispatch(setNumberOfFinalStates(payload))

      setLocalFinalStates([...localFinalStates, circles.length])
      const finalStatePayload = {
        one: props?.one,
        finalStates: [...localFinalStates, circles.length]
      }
      dispatch(setFinalStates(finalStatePayload))

    } else if (nodeType === 'START') {
      if( startStates >= 1) {
        return
      }

      setStartStates(startStates + 1)
      const payload = {
        one: props?.one,
        count: circles.length
      }
      dispatch(setNumberOfStartStates(payload))
    } else {
      if (startStates === 0) {
        return
      }
    }

    const circle = React.createElement(DraggableCircle, {
      innerDetails: innerDetails(nodeType),
      locX: event.clientX,
      locY: event.clientY,
      color: NodeTypes[nodeType]?.color,
      stateIndex: circles.length, 
      createArrow: createArrow,
      setArrow: setArrow,
      emptyDrag: emptyDrag,
      updateXarrrow: updateXarrrow
    })

    const newCircles = [...circles, circle]

    setCircles(newCircles)
    console.log(nodeType)
    
    const payload = {
      one: props?.one,
      count: newCircles.length
    }
    dispatch(setNumberOfStates(payload))
  }

  return (
    <>
      <Xwrapper>
        {
          circles
        }
        {
          Object.values(arrows)
        }
        {
          tempArrow
        }
      </Xwrapper>
      <div id="empty-drag" style={{
        top: emptyY,
        left: emptyX,
        position: 'absolute'
      }}></div>
      <div style={styles.sidebar}>
        <Sidebar onDrag={onDrag} />
      </div>

    </>
  );
};

export default DfaMaker;