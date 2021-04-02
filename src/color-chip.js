import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import './style.css'

export default class ColorChip extends React.Component {

  getHex = (r,g,b) => {
    var hexStr = "#";
    if (r < 16) hexStr += "0";
    hexStr += r.toString(16);
    if (g < 16) hexStr += "0";
    hexStr += g.toString(16);
    if (b < 16) hexStr += "0";
    hexStr += b.toString(16);
    return hexStr;
  }

  render() {
    var colorName = this.props.color.color[0];
    var r = this.props.color.color[1]
    var g = this.props.color.color[2]
    var b = this.props.color.color[3]
    var altName = "";
    if (colorName[0] === "#")
      // Color name is already a hex code. Use rgb instead.
      altName = "(" + r.toString() + ", " + g.toString() + ", " + b.toString() + ")";
    else
      altName = this.getHex(r, g, b);
    var textColor = 'black';
    // These weights are initially in App state, and can be reset by the user.
    // For the purpose of choosing a text color, we can keep using the initial weights.
    if (0.299 * r + 0.587 * g + 0.114 * b < 100) textColor = 'white';

    return (
      <Draggable
        draggableId={this.props.color.id}
        index={this.props.index}
      >
        {provided => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <div  /* This div has to be nested because draggableProps overwrites style. */
              className="ColorChip"
              style={{ backgroundColor: colorName, color: textColor, paddingTop: 15 }}
            >
              <p>{colorName}</p>
              <p>{altName}</p>
            </div>
          </div>
        )}
      </Draggable>
    )
  }
}