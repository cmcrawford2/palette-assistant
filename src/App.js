import React from "react";
import initialData from './initial_data.js'
import { DragDropContext } from 'react-beautiful-dnd';
import Palette from './palette.js'
import Recomputed from './recomputed.js'
import computeNewWeights from './compute-weights.js'
import "./style.css";

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
    // Reinitialize sorting and recomputing logicals.
    // Don't reset newWeights. They should persist so we can test how well they work.
    newState.sortedMode = false;
    newState.recomputed = false;
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

  // Restore the named colors
  resetHTML = () => {
    var colorIds = this.state.palettes["main"].colorIds.slice();
    this.removePersonalColors(colorIds);
    var newState = this.refillRows(colorIds);
    newState.randomMode = false;
    newState.sortedMode = false;
    newState.recomputed = false;
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
    return (this.state.rWeight * (color2.color[1] - color1.color[1]) +
            this.state.gWeight * (color2.color[2] - color1.color[2]) +
            this.state.bWeight * (color2.color[3] - color1.color[3]));
  }

  removePersonalColors = (colorIds) => {
  // Remove any chips that are in the personal palette.
    var personalIds = this.state.palettes["personal"].colorIds;
    if (personalIds.length > 0) {
      for (var i = 0; i < personalIds.length; i++) {
        // remove this id from the colorIds array.
        var c_i = colorIds.indexOf(personalIds[i]);
        if (c_i >= 0)
          colorIds.splice(c_i, 1);
      }
    }
  }

  getSortableArray = () => {
    var colorIds = [];
    if (this.state.randomMode === false)
      colorIds = this.state.palettes["main"].colorIds.slice();
    else
      colorIds = this.state.palettes["random"].colorIds.slice();
    this.removePersonalColors(colorIds);
    return colorIds;
  }

  sortRGB = () => {
    var grays = [];
    var reds = [];
    var greens = [];
    var blues = [];
    var colorIds = this.getSortableArray();

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

    // Order of the new display is r, g, b, gray.
    var newState = this.refillRows(reds.concat(greens, blues, grays));
    newState.sortedMode = false;
    newState.recomputed = false;
    this.setState(newState);
  }

  sortCMYK = () => {
    var cyans = [];
    var magentas = [];
    var yellows = [];
    var grays = [];
    var colorIds = this.getSortableArray();

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
    var newState = this.refillRows(cyans.concat(magentas, yellows, grays));
    newState.sortedMode = false;
    newState.recomputed = false;
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
    var colorIds = this.getSortableArray();

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
    var newState = this.refillRows(reds.concat(yellows, greens, cyans, blues, magentas, grays));
    newState.sortedMode = false;
    newState.recomputed = false;
    this.setState(newState);
  }

  sortLightToDark = () => {
    var colorCopy = this.getSortableArray();
    colorCopy.sort(this.compareWeighted);
    var newState = this.refillRows(colorCopy);
    newState.sortedMode = true;
    newState.recomputed = false;
    this.setState(newState);
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
    return newState;
  }

  recomputeWeights = () => {
    // Assemble array of rbg of colors in user order.
    // Only do this if the palette has been totally sorted.
    // Todo: some kind of error handling that can be displayed to the user.
    // this.state.recomputed is basically only used to format an error message.
    if (this.state.sortedMode === false) {
      this.setState({ recomputed: true });
      return;
    }
    var colorIdArray = [];
    for (var pi = 0; pi < this.state.paletteOrder.length; pi++) {
      var paletteColorIds = this.state.palettes[this.state.paletteOrder[pi]].colorIds;
      for (var ci = 0; ci < paletteColorIds.length; ci++) {
        colorIdArray.push(paletteColorIds[ci]);
      }
      // For debugging
      // if (pi === 0) break;
    }

    var colorArray = [];
    for (ci = 0; ci < colorIdArray.length; ci++) {
      var color = this.state.colors[colorIdArray[ci]].color;
      colorArray[ci] = [];
      colorArray[ci][0] = color[1]/255;
      colorArray[ci][1] = color[2]/255;
      colorArray[ci][2] = color[3]/255;
    }
    var newWeights = computeNewWeights(colorArray);
    var newState = { ...this.state };
    newState.recomputed = true;
    newState.newWeights = true;
    newState.rWeight = newWeights[0].toFixed(3);
    newState.gWeight = newWeights[1].toFixed(3);
    newState.bWeight = newWeights[2].toFixed(3);
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
            palette={this.state.palettes['personal']}
            colorArray={this.state.palettes['personal'].colorIds.map(colorId => this.state.colors[colorId])}
          />
          <div className="SortDescriptionContainer">
            <div className="SortDescription">
              <h3>Sorted colors are grouped by predominant hue and sorted by perceived lightness.</h3>
              <h3>Perceived lightness is initially computed as 0.299 red + 0.587 green + 0.114 blue.</h3>
              <h3>If you think you can come up with a better order, move the chips around and select "Recompute" to compute new coefficients.</h3>
            </div>
          </div>
          <div className="ButtonRow">
            <button className="SortButton" onClick={this.randomSet}>
              Random
            </button>
            <button className="SortButton" onClick={this.resetHTML}>
              Reset HTML
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
            <button className="SortButton" onClick={this.recomputeWeights}>
              Recompute
            </button>
          </div>
          <Recomputed sorted={this.state.sortedMode} computed={this.state.recomputed} weights={this.state.newWeights}
                      rw={this.state.rWeight} gw={this.state.gWeight} bw={this.state.bWeight} />
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
