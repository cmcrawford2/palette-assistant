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
    const { destination, source } = result;
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
      var movedId = newColorIds[source.index];
      newColorIds.splice(source.index, 1);
      
      // Put it in the new position.
      newColorIds.splice(destination.index, 0, movedId);

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

  toHexColor = (r, g, b) => {
    var HexColor = "#";
    if (r < 16) HexColor += "0";
    HexColor += r.toString(16);
    if (g < 16) HexColor += "0";
    HexColor += g.toString(16);
    if (b < 16) HexColor += "0";
    HexColor += b.toString(16);
    return HexColor;
  }

  // Generate a random set of colors
  
  randomSet = () => {
    // Make a copy of state that we will modify directly.
    var newState = { ...this.state };
    newState.randomMode = true;
    // Use colorIds starting from 200.
    for (var i = 0; i < 100; i++) {
      // Make a new color
      var r = Math.floor(256*Math.random());
      var g = Math.floor(256*Math.random());
      var b = Math.floor(256*Math.random());
      var colorName = this.toHexColor(r, g, b);
      const newColor = [colorName, r, g, b];
      var colorId = "color-" + (i+201).toString();
      newState.colors[colorId].color = newColor;
    }
    // Only show the first 10 rows.
    // These palettes won't be used once the sort buttons are pushed. But for now they are useful.
    const newPaletteOrder = ['p201', 'p202', 'p203', 'p204', 'p205', 'p206', 'p207', 'p208', 'p209', 'p210'];
    newState.paletteOrder = newPaletteOrder;
    this.setState(newState);
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
    var colorIds = [];
    if (this.state.randomMode === false)
      colorIds = this.state.palettes["main"].colorIds;
    else
      colorIds = this.state.palettes["random"].colorIds;
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

    // Cannot update actual state in a loop because setState is asynchronous.
    var newState = { ...this.state };
    var newPaletteOrder = [];

    var p_i = 1;
    for (i = 0; i < 4; i++) {
      var curA = [];
      if (i === 0) { curA = reds; }
      else if (i === 1) { curA = greens; }
      else if (i === 2) { curA = blues; }
      else { curA = grays; }

      var n_p = Math.ceil(0.1 * curA.length); // Number of rows, 10 color chips each plus remainder row.
      
      for (var j = 0; j < n_p; j++, p_i++) {
        var colorSection = curA.slice(10 * j, 10 * (j + 1));
        var paletteId = "p" + p_i.toString();
        var newPalette = {
          ...this.state.palettes[paletteId],
          colorIds: colorSection,
        };
        var tempState = {
          ...newState,
          palettes: {
            ...newState.palettes,
            [newPalette.id]: newPalette,
          },
        };
        newState = tempState;
        newPaletteOrder.push(paletteId);
      }
    }
    newState.paletteOrder = newPaletteOrder;
    this.setState(newState);
  }

  sortCMYK = () => {
    var cyans = [];
    var magentas = [];
    var yellows = [];
    var grays = [];
    var colorIds = [];
    if (this.state.randomMode === false)
      colorIds = this.state.palettes["main"].colorIds;
    else
      colorIds = this.state.palettes["random"].colorIds;
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

    // Cannot update actual state in a loop because setState is asynchronous.
    var newState = { ...this.state };
    var newPaletteOrder = [];

    var p_i = 1;
    for (i = 0; i < 4; i++) {
      var curA = [];
      if (i === 0) { curA = cyans; }
      else if (i === 1) { curA = magentas; }
      else if (i === 2) { curA = yellows; }
      else { curA = grays; }

      var n_p = Math.ceil(0.1 * curA.length); // Number of rows, 10 color chips each plus remainder row.

      for (var j = 0; j < n_p; j++, p_i++) {
        var colorSection = curA.slice(10 * j, 10 * (j + 1));
        var paletteId = "p" + p_i.toString();
        var newPalette = {
          ...this.state.palettes[paletteId],
          colorIds: colorSection,
        };
        var tempState = {
          ...newState,
          palettes: {
            ...newState.palettes,
            [newPalette.id]: newPalette,
          },
        };
        newState = tempState;
        newPaletteOrder.push(paletteId);
      }
    }
    newState.paletteOrder = newPaletteOrder;
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
    var colorIds = [];
    if (this.state.randomMode === false)
      colorIds = this.state.palettes["main"].colorIds;
    else
      colorIds = this.state.palettes["random"].colorIds;
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

    // Cannot update actual state in a loop because setState is asynchronous.
    var newState = { ...this.state };
    var newPaletteOrder = [];

    var p_i = 1;
    for (i = 0; i < 7; i++) {
      var curA = [];
      if (i === 0) { curA = reds; }
      else if (i === 1) { curA = yellows; }
      else if (i === 2) { curA = greens; }
      else if (i === 3) { curA = cyans; }
      else if (i === 4) { curA = blues; }
      else if (i === 5) { curA = magentas; }
      else { curA = grays; }

      var n_p = Math.ceil(0.1 * curA.length); // Number of rows, 10 color chips each plus remainder row.

      for (var j = 0; j < n_p; j++, p_i++) {
        var colorSection = curA.slice(10 * j, 10 * (j + 1));
        var paletteId = "p" + p_i.toString();
        var newPalette = {
          ...this.state.palettes[paletteId],
          colorIds: colorSection,
        };
        var tempState = {
          ...newState,
          palettes: {
            ...newState.palettes,
            [newPalette.id]: newPalette,
          },
        };
        newState = tempState;
        newPaletteOrder.push(paletteId);
      }
    }
    newState.paletteOrder = newPaletteOrder;
    this.setState(newState);
  }

  sortLightToDark = () => {
    var colorCopy = [];
    if (this.state.randomMode === false)
      colorCopy = this.state.palettes["main"].colorIds;
    else
      colorCopy = this.state.palettes["random"].colorIds;
    colorCopy.sort(this.compareWeighted);
    // we might want to update ids in main array to reflect new order, but not now.
    // Update ids in the 15 rows.
    // For now we have 15 rows, hard coded.
    // Todo: dynamic based on screen width.
    // Update internal state and then setState at the very end.
    // Otherwise it won't work because this.state isn't actually updated until later.
    var newState = {...this.state};
    for (var i = 0; i < 15; i++) {
      var colorSection = colorCopy.slice(10*i, 10*(i+1)); // last row is short but slice does what we need.
      var paletteId = "p" + (i+1).toString();
      var newPalette = {
        ...this.state.palettes[paletteId],
        colorIds: colorSection,
      };
      var tempState = {
        ...newState,
        palettes: {
          ...newState.palettes,
          [newPalette.id]: newPalette,
        },
      };
      newState = tempState;
    }
    
    // In random mode, we need to tell state that colors are now in the first ten rows.
    if (this.state.randomMode === true) {
      newState.paletteOrder = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10'];
    }

    this.setState(newState);
  }
  
  // Always render the personal palette.
  // Use the paletteOrder array to render any other palettes.

  render() {
    return (
    <div className="App">
      <header className="App-header">
        <h1>Personal Palette Assistant</h1>
        <div className="App-description">
          <h3>Drag and drop color chips into your personal palette (the blank space below).</h3>
          <h3>Or, sort and rearrange the color chips in the main section.</h3>
        </div>
      </header>
      <div>
        <DragDropContext
          onDragEnd = {this.onDragEnd}>
          <Palette
            key={'personal'}
            rMode = {this.state.randomMode}
            palette={this.state.palettes['personal']}
            colorArray={this.state.palettes['personal'].colorIds.map(colorId => this.state.colors[colorId])}
          />
          <div className="ButtonRow">
            <button className="SortButton" onClick={this.randomSet}>
              Random
            </button>
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
            return <Palette key={palette.id} rMode={this.state.rMode} palette={palette} colorArray={colorArray} />
          })}
        </DragDropContext>
      </div>
    </div>
    )
  }
}

export default App;
