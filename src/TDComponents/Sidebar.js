import React from 'react';
import Circle from './Circle';
import { NodeTypes } from './NodeTypes';

const Sidebar = (props) => {

  const innerDetails = (text) => {
    return (
      <h3 style={{textAlign: 'center'}}>{text}</h3>
    )
  }

  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <div className="dndnode input" onDragEnd={(event) => props.onDrag(event, NodeTypes.START.title.toUpperCase())} draggable>
        <Circle
          color = {NodeTypes.START.color}
          innerDetails = {innerDetails(NodeTypes.START.title)}
        />
      </div>
      <div className="dndnode input" onDragEnd={(event) => props.onDrag(event, NodeTypes.DEFAULT.title.toUpperCase())} draggable>
        <Circle
          innerDetails = {innerDetails(NodeTypes.DEFAULT.title)}
        />
      </div>
      <div className="dndnode input" onDragEnd={(event) => props.onDrag(event, NodeTypes.FINAL.title.toUpperCase())} draggable>
        <Circle
          color = {NodeTypes.FINAL.color}
          innerDetails = {innerDetails(NodeTypes.FINAL.title)}
        />
      </div>
    </aside>
  );
};

export default Sidebar