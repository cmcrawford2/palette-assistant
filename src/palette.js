import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import ColorChip from './color-chip.js';
import './style.css';

// Input is one of the several palette structures, which is to be displayed.
// Output is the palette element, which is a box holding the rendered color chips.
// Chips can be dragged and dropped from any rendered palette into any other, or rearranged.

export default class Palette extends React.Component {
  render() {
    return (
      <Droppable droppableId = {this.props.palette.id} direction="horizontal">
        {provided => (
          <div
            className="RowOfChips"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
              {this.props.colorArray.map((color, index) => {
                return <ColorChip key={color.id} color={color} index={index} />
              })}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  }
}