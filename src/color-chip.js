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
    var r = this.props.color.color[1]
    var g = this.props.color.color[2]
    var b = this.props.color.color[3]
    var hexString = this.getHex(r, g, b);
    var textColor = 'black';
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
              style={{ backgroundColor: this.props.color.color[0], color: textColor, paddingTop: 15 }}
            >
              <p>{this.props.color.color[0]}</p>
              <p>{hexString}</p>
            </div>
          </div>
        )}
      </Draggable>
    )
  }
}