import { useState } from "react";

function DraggableCircle(props) {
  const [locX, setLocX] = useState(props.locX)
  const [locY, setLocY] = useState(props.locY)


  const styles = {
    circle: {
      width: 85,
      height: 85,
      borderRadius: '50%',
      backgroundColor: 'black',
      display: 'inline-block',
      position: props?.locX ? 'absolute' : 'static',
      border: 'black',
      borderSize: 5,
      paddingLeft: 10,
      paddingTop: 10,
      pointEvents: 'none'
    },
    smallerCircle: {
      width: 75,
      height: 75,
      borderRadius: '50%',
      backgroundColor: props?.color ? props.color : '#bbb',
      display: 'inline-block',
      position: props?.locX ? 'absolute' : 'static',
      border: 'black',
      borderSize: 5,
      pointEvents: 'none'
    },
    center: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      margin: '-37.5 0 0 -37.5px' /* Apply negative top and left margins to truly center the element */
    }
  }

  const onDragEnd = (event) => {
    if (event.clientX !== 0) {
      event.stopPropagation();
      setLocX(event.clientX)
      setLocY(event.clientY)
    }
    props.updateXarrrow(event)
  }

  const onDragStart = (event) => {
    event.stopPropagation();
    var ghost = document.getElementById('empty');
    ghost.style.transform = "translate(-10000px, -10000px)";
    ghost.style.zIndex = "-50"
    ghost.style['z-index'] = "-50"
    ghost.style.position = "absolute";

    event.dataTransfer.setDragImage(ghost, 0, 0)
  }



  return (
    <div 
      id={`state-${props.stateIndex}`}
      style={{...styles.circle, ...{
        top: locY - (75/2),
        left: locX - (75/2),
        zIndex: -50,
      }}} 
      draggable 
      onDragStart={(e) => props.createArrow(e, props.stateIndex)}
      onDrag={props.emptyDrag}
      onDragEnd={(e) => props.setArrow(e, props.stateIndex)}
    >
      <div id={`state-${props.stateIndex}`} style={styles.smallerCircle} draggable onDragStart={onDragStart} onDrag={onDragEnd} onDragEnd={onDragEnd}>
        <div style={styles.center}></div>
        {
          props?.innerDetails &&
          props.innerDetails
        }
      </div>
      <div id="empty"></div>
    </div>
  );
}

export default DraggableCircle;
