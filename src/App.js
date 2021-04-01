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
      // Make all the rows of main display other than the last row have 10 chips again.
      // This is because I'm stuck with fixed rows for now to make react-beautiful-dnd work.
      var pOrder = this.state.paletteOrder;
      for (var p_i = 0; p_i < pOrder.length-1; p_i++) {
        var rowLength = newState2.palettes[pOrder[p_i]].colorIds.length;
        if (rowLength > 10) {
          // Put the end of this row at the beginning of the next row
          var extraId = newState2.palettes[pOrder[p_i]].colorIds.pop();
          newState2.palettes[pOrder[p_i+1]].colorIds.unshift(extraId);
        }
        else if (rowLength < 10) {
          // Append the beginning of the next row to the end of row
          extraId = newState2.palettes[pOrder[p_i+1]].colorIds.shift();
          newState2.palettes[pOrder[p_i]].colorIds.push(extraId);
          // If we emptied the last row, remove it from the display.
          if (p_i === pOrder.length-2 &&
              newState2.palettes[pOrder[p_i+1]].colorIds.length === 0) {
            newState2.paletteOrder.pop();
            }
          }
        }
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
    // We do this in case we ever decided go back to HTML colors.
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
    // Only show the first 10 rows (palettes).
    // These palettes won't be used once the sort buttons are pushed.
    // But for now it saves us from having to refill p1 through p10.
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

    // We won't separate the lists into sections on the display.
    // Order is r, g, b, k.
    var sortedIds = reds.concat(greens, blues, grays);

    this.refillRows(sortedIds);
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

    // Order of the new display is cyan, magenta, yellow, gray.

    var sortedIds = cyans.concat(magentas, yellows, grays);

    this.refillRows(sortedIds);
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

    // Order of the new display is R Y G C B M K
    var sortedIds = reds.concat(yellows, greens, cyans, blues, magentas, grays);

    this.refillRows(sortedIds);
  }

  sortLightToDark = () => {
    var colorCopy = [];
    if (this.state.randomMode === false)
      colorCopy = this.state.palettes["main"].colorIds;
    else
      colorCopy = this.state.palettes["random"].colorIds;
    colorCopy.sort(this.compareWeighted);
    this.refillRows(colorCopy);
  }
  
  refillRows = (newColorIds) => {
    // Cannot update actual state in a loop because setState is asynchronous.
    var newState = { ...this.state };
    var newPaletteOrder = [];

    var n_p = Math.ceil(0.1 * newColorIds.length); // Number of rows, 10 color chips each plus remainder row.

    for (var i = 0; i < n_p; i++) {
      var colorSection = newColorIds.slice(10 * i, 10 * (i + 1));
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
      newPaletteOrder.push(paletteId);
    }
    newState.paletteOrder = newPaletteOrder;
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
