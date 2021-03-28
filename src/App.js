import React from "react";
import initialData from './initial_data.js'
import { DragDropContext } from 'react-beautiful-dnd';
import Palette from './palette.js'
import "./style.css";

// Using relative luminance https://planetcalc.com/7779/
const gWeight = 0.587;
const rWeight = 0.299;
const bWeight = 0.114;

class App extends React.Component {
  // Initialize the state with structures representing 147 colors, useful palettes,
  // and an array of active palette IDs.

  state = initialData;

  // Drag and Drop Stuff

  onDragEnd = result => {
    // Update the state after the drag operation ends.
    const { destination, source, draggableID } = result;
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableID &&
        destination.index === source.index) {
      return;
    }
    if (source.droppableId === destination.droppableId) {
      var newColorIds = this.state.palettes[source.droppableId].colorIds;
      // Remove moved color
      newColorIds.splice(source.index, 1);
      
      // Put it in the new position.
      newColorIds.splice(destination.index, 0, draggableID);

      // Create new state
      const newPalette = {
        ...this.state.palettes[source.droppableId],
        colorIds: newColorIds,
      };
      const newState = {
        ...this.state,
        palettes: {
          ...this.state.palettes,
          [newPalette.id]: newPalette,
        },
      };
      this.setState(newState);
    }

    else {
      // Remove moved color from the palette it came from.
      var fromColorIds = this.state.palettes[source.droppableId].colorIds;
      var movedColorId = fromColorIds[source.index];
      fromColorIds.splice(source.index, 1);

      // Put moved color into the destination palette.
      var toColorIds = this.state.palettes[destination.droppableId].colorIds;
      toColorIds.splice(destination.index, 0, movedColorId);

      // Create new state with two updated palettes.
      const fromPalette = {
        ...this.state.palettes[source.droppableId],
        colorIds: fromColorIds,
      }
      const toPalette = {
        ...this.state.palettes[destination.droppableId],
        colorIds: toColorIds,
      }
      const newState2 = {
        ...this.state,
        palettes: {
          ...this.state.palettes,
          [fromPalette.id]: fromPalette,
          [toPalette.id]: toPalette,
        },
      };
      this.setState(newState2);
    }
  }

  // Sorting stuff

  compareLightness = (color1, color2) => {
    // From wikipedia - doesn't really do it for me.
    var XMax1 = Math.max(color1.color[1], color1.color[2], color1.color[3]);
    var XMin1 = Math.min(color1.color[1], color1.color[2], color1.color[3]);
    var XMax2 = Math.max(color2.color[1], color2.color[2], color2.color[3]);
    var XMin2 = Math.min(color2.color[1], color2.color[2], color2.color[3]);
    return (XMax2 + XMin2) - (XMax1 + XMin1);
  }

  compareWeighted = (colorId1, colorId2) => {
    var color1 = this.state.colors[colorId1];
    var color2 = this.state.colors[colorId2];
    return (rWeight * (color2.color[1] * color2.color[1] - color1.color[1] * color1.color[1]) +
      gWeight * (color2.color[2] * color2.color[2] - color1.color[2] * color1.color[2]) +
      bWeight * (color2.color[3] * color2.color[3] - color1.color[3] * color1.color[3]));
  }

  sortRGB = () => {
    var grays = [];
    var reds = [];
    var greens = [];
    var blues = [];
    // For now all chips are in the main palette area.
    var colorIds = this.state.palettes["main"].colorIds;
    for (var i = 0; i < colorIds.length; i++) {
      var colorId = colorIds[i];
      var colorChip = this.state.colors[colorId];
      var r = colorChip.color[1];
      var g = colorChip.color[2];
      var b = colorChip.color[3];
      if (r === g && r === b) {
        grays.push(colorId);
      }
      else if (r >= g && r > b) {
        reds.push(colorId);
      }
      else if (g >= b && g > r) {
        greens.push(colorId);
      }
      else { // b >= r && b > g
        blues.push(colorId);
      }
    }
    grays.sort(this.compareWeighted);
    reds.sort(this.compareWeighted);
    greens.sort(this.compareWeighted);
    blues.sort(this.compareWeighted);

    const grayPalette = {
      ...this.state.palettes['gray'],
      colorIds: grays,
    }
    const redPalette = {
      ...this.state.palettes['red'],
      colorIds: reds,
    }
    const greenPalette = {
      ...this.state.palettes['green'],
      colorIds: greens,
    }
    const bluePalette = {
      ...this.state.palettes['blue'],
      colorIds: blues,
    }

    // Don't empty main palette Ids. Just don't display.

    const newPaletteOrder = ['red', 'green', 'blue', 'gray'];

    const newState = {
      ...this.state,
      palettes: {
        ...this.state.palettes,
        ['gray']: grayPalette,
        ['red']: redPalette,
        ['green']: greenPalette,
        ['blue']: bluePalette,
      },
      paletteOrder: newPaletteOrder,
    };

    this.setState(newState);
  }

  sortCMYK = () => {
    var cyans = [];
    var magentas = [];
    var yellows = [];
    var grays = [];
    // For now all chips are in the main palette area.
    var colorIds = this.state.palettes["main"].colorIds;
    for (var i = 0; i < colorIds.length; i++) {
      var colorId = colorIds[i];
      var colorChip = this.state.colors[colorId];
      var r = colorChip.color[1];
      var g = colorChip.color[2];
      var b = colorChip.color[3];
      if (r === g && r === b) {
        grays.push(colorId);
      }
      else if (r < g && r <= b) {
        cyans.push(colorId);
      }
      else if (g <= b && g <= r) {
        magentas.push(colorId);
      }
      else { // b < r && b < g
        yellows.push(colorId);
      }
    }
    grays.sort(this.compareWeighted);
    cyans.sort(this.compareWeighted);
    magentas.sort(this.compareWeighted);
    yellows.sort(this.compareWeighted);

    const grayPalette = {
      ...this.state.palettes['gray'],
      colorIds: grays,
    }
    const cyanPalette = {
      ...this.state.palettes['cyan'],
      colorIds: cyans,
    }
    const magentaPalette = {
      ...this.state.palettes['magenta'],
      colorIds: magentas,
    }
    const yellowPalette = {
      ...this.state.palettes['yellow'],
      colorIds: yellows,
    }

    // Don't empty main palette Ids. Just don't display.

    const newPaletteOrder = ['cyan', 'magenta', 'yellow', 'gray'];

    const newState = {
      ...this.state,
      palettes: {
        ...this.state.palettes,
        ['gray']: grayPalette,
        ['cyan']: cyanPalette,
        ['magenta']: magentaPalette,
        ['yellow']: yellowPalette,
      },
      paletteOrder: newPaletteOrder,
    };

    this.setState(newState);
  }

  sort6 = () => {
    var reds = [];
    var greens = [];
    var blues = [];
    var cyans = [];
    var magentas = [];
    var yellows = [];
    var grays = [];
    // For now all chips are in the main palette area.
    var colorIds = this.state.palettes["main"].colorIds;
    for (var i = 0; i < colorIds.length; i++) {
      var colorId = colorIds[i];
      var colorChip = this.state.colors[colorId];
      // Take out the darkest value to sort into buckets.
      var darkest = Math.min(colorChip.color[1], colorChip.color[2], colorChip.color[3]);
      var r = colorChip.color[1] - darkest;
      var g = colorChip.color[2] - darkest;
      var b = colorChip.color[3] - darkest;
      if (r === g && r === b) {
        grays.push(colorId);
      }
      else if (r >= 2*b && r >= 2*g) {
        reds.push(colorId);
      }
      else if (b >= 2*g && b >= 2*r) {
        blues.push(colorId);
      }
      else if (g >= 2*r && g >= 2*b) {
        greens.push(colorId);
      }
      else if (r > b && g > b && r < 2*g && g < 2*r) {
        yellows.push(colorId);
      }
      else if (b > g && r > g && b < 2*r && r < 2*b) {
        magentas.push(colorId);
      }
      else if (g > r && b > r && g < 2*b && b < 2*g) {
        cyans.push(colorId);
      }
    }
    reds.sort(this.compareWeighted);
    greens.sort(this.compareWeighted);
    blues.sort(this.compareWeighted);
    cyans.sort(this.compareWeighted);
    magentas.sort(this.compareWeighted);
    yellows.sort(this.compareWeighted);
    grays.sort(this.compareWeighted);

    const grayPalette = {
      ...this.state.palettes['gray'],
      colorIds: grays,
    }
    const redPalette = {
      ...this.state.palettes['red'],
      colorIds: reds,
    }
    const greenPalette = {
      ...this.state.palettes['green'],
      colorIds: greens,
    }
    const bluePalette = {
      ...this.state.palettes['blue'],
      colorIds: blues,
    }
    const cyanPalette = {
      ...this.state.palettes['cyan'],
      colorIds: cyans,
    }
    const magentaPalette = {
      ...this.state.palettes['magenta'],
      colorIds: magentas,
    }
    const yellowPalette = {
      ...this.state.palettes['yellow'],
      colorIds: yellows,
    }

    // Don't empty main palette Ids. Just don't display.

    const newPaletteOrder = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta', 'gray'];

    const newState = {
      ...this.state,
      palettes: {
        ...this.state.palettes,
        ['gray']: grayPalette,
        ['red']: redPalette,
        ['green']: greenPalette,
        ['blue']: bluePalette,
        ['cyan']: cyanPalette,
        ['magenta']: magentaPalette,
        ['yellow']: yellowPalette,
      },
      paletteOrder: newPaletteOrder,
    };

    this.setState(newState);
  }

  sortLightToDark = () => {
    var colorCopy = this.state.palettes['main'].colorIds;
    colorCopy.sort(this.compareWeighted);
    const newPalette = {
      ...this.state.palettes['main'],
      colorIds: colorCopy,
    };

    const newPaletteOrder = ['main'];

    const newState = {
      ...this.state,
      palettes: {
        ...this.state.palettes,
        [newPalette.id]: newPalette,
      },
      paletteOrder: newPaletteOrder,
    };

    this.setState(newState);
  }
  
  // Always render the personal palette.
  // Use the paletteOrder array to render any other palettes.
  
  render() {
    return (
    <div className="App">
      <header className="App-header">
        <h1>Personal Palette Assistant</h1>
      </header>
      <div>
        <DragDropContext
          onDragEnd = {this.onDragEnd}>
          <Palette
            key={'personal'}
            palette={this.state.palettes['personal']}
            colorArray={this.state.palettes['personal'].colorIds.map(colorId => this.state.colors[colorId])}
          />
          <div className="ButtonRow">
            <button className="SortButton" onClick={this.sortRGB}>
              Sort RGB
            </button>
            <button className="SortButton" onClick={this.sortCMYK}>
              Sort CMYK
            </button>
            <button className="SortButton" onClick={this.sort6}>
              Six colors
            </button>
            <button className="SortButton" onClick={this.sortLightToDark}>
              Sort Light
            </button>
          </div>
          {this.state.paletteOrder.map(paletteId => {
            const palette = this.state.palettes[paletteId];
            const colorArray = palette.colorIds.map(colorId => this.state.colors[colorId]);
            return <Palette key={palette.id} palette={palette} colorArray={colorArray} />
          })}
        </DragDropContext>
      </div>
    </div>
    )
  }
}

export default App;
