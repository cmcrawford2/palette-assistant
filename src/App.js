import React from "react";
import initialData from './initial_data.js'
import { DragDropContext } from 'react-beautiful-dnd';
import Palette from './palette.js'
import Recomputed from './recomputed.js'
import computeNewWeights from './compute-weights.js'
import getColorScheme from './color-scheme.js'
import matchPaletteColors from './match-palette.js'
import expandPaletteColors from './expand-palette.js'
import "./style.css";
import { sqrt } from "mathjs";
import { sortRGB, sortCMYK, sort6 } from './sort-colors.js'

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

// ********** Utility functions for managing the data in state. ***********

togglePalette = (color_id) => {
  // Double click sends color chip from personal palette to grid and vice versa.
  const paletteArray = [...this.state.palettes['personal'].colorIds];
  const gridColorArray = this.getColorIdsFromGrid();
  let personal_index = paletteArray.indexOf(color_id);
  if (personal_index >= 0) {
    // Put the personal palette chip back into the grid
    paletteArray.splice(personal_index, 1);
    // Prepend to grid colors
    gridColorArray.unshift(color_id);
  }
  else {
    personal_index = gridColorArray.indexOf(color_id);
    if (personal_index >= 0) {
      gridColorArray.splice(personal_index, 1);
      // Append to personal palette
      paletteArray.push(color_id);
    }
  }
  // Refill the grid rows into a temporary copy of state.
  var toggledState = { ...this.state };
  toggledState = this.refillRows(toggledState, gridColorArray);
  
  // Create a new personal palette
  var newPalette = {
    ...toggledState.palettes['personal'],
    colorIds: paletteArray,
  };

  var newState = {
    ...toggledState,
    palettes: {
      ...toggledState.palettes,
      [newPalette.id]: newPalette,
    },
  }
  this.setState(newState);
}

// Color chips should not appear in more than one place. Drag and Drop requires all the "droppables" to have unique ids.
// so before we reformat the grid using a button function, we need to remove any color that has been placed in the personal palette.

  removeColorsFromArray = (removeIds, colorIds) => {
    // Remove any chips that are in the personal palette.
    if (removeIds.length > 0) {
      for (var i = 0; i < removeIds.length; i++) {
        // remove this id from the colorIds array.
        var c_i = colorIds.indexOf(removeIds[i]);
        if (c_i >= 0)
          colorIds.splice(c_i, 1);
      }
    }
  }

// Fill the grid rows ("palettes") with input color ids.
// Whether random or HTML (randomMode === false) has to be properly set in the new state.
// This should be called in two ways.
// 1: newColorIds include all the colors, and personal palette is empty.
// 2: Otherwise make sure before calling this that there are no colors in both personal palette and in the newColorIds array.

  refillRows = (newState, newColorIds) => {
    // Cannot update actual state in a loop because setState is asynchronous.
    // Also because of this, newState is not modified, but a different state is returned.
    var newPaletteOrder = [];

    var n_p = Math.ceil(0.1 * newColorIds.length); // Number of rows, 10 color chips each plus remainder row.

    var offset = (newState.randomMode === false) ? 1 : 201;

    for (var i = 0; i < n_p; i++) {
      var colorSection = newColorIds.slice(10 * i, 10 * (i + 1));
      var paletteId = "p" + (i + offset).toString();
      var newPalette = {
        ...newState.palettes[paletteId],
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
    // This function makes a new grid of 100 random colors.
    // It also clears the personal palette.

    // Make a copy of state that we will modify directly.
    var newState = { ...this.state };
    newState.randomMode = true;

    // Reinitialize sorting and recomputing logicals.
    // Don't reset newWeights. They should persist so we can test how well they work.
    newState.sortedMode = false;
    newState.recomputed = false;

    // Use color Ids starting from 200.
    // HTML named colors use ids 1 to 147.
    var colorIds = [];
    for (var i = 0; i < 100; i++) {
      var colorId = "color-" + (i+201).toString();
      colorIds.push(colorId);
    }

    // Now compute 100 random colors!
    for (i = 0; i < 100; i++) {
      var r = Math.floor(256*Math.random());
      var g = Math.floor(256*Math.random());
      var b = Math.floor(256*Math.random());
      var colorName = this.toHexColor(r, g, b);
      const newColor = [colorName, r, g, b];
      newState.colors[colorIds[i]].color = newColor;
    }

    // Refill the rows and the row palette id lists.
    newState = this.refillRows(newState, colorIds);
    
    // Reset the personal palette to be empty.
    newState.palettes['personal'].colorIds = [];

    this.setState(newState);
  }

  // Restore the named colors in alphabetical order

  resetHTML = () => {
    // All of the HTML named color ids live in the main palette.
    // The could conceivably live outside somewhere, since "main" doesn't change.
    var colorIds = this.state.palettes["main"].colorIds.slice();
    var newState = { ...this.state };
    newState.randomMode = false;
    newState.sortedMode = false;
    newState.recomputed = false;

    // Refill the rows and the row palette id lists.
    newState = this.refillRows(newState, colorIds);

    // Rest the personal palette to be empty.
    newState.palettes['personal'].colorIds = [];

    this.setState(newState);
  }

  // ********** Sorting stuff ************

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

  sort = (sortByGroup) => {
    // SortByGroup function subdivides by color group before sorting.
    // Can by by RGB, CMYK, or both (sort6).
    var colorIds = this.getColorIdsFromGrid();
    var sortedIds = sortByGroup(this.state.colors, colorIds, this.compareWeighted);
    var newState = { ...this.state };
    newState = this.refillRows(newState, sortedIds);
    newState.sortedMode = false;
    newState.recomputed = false;
    this.setState(newState);
  }

  sortLightToDark = () => {
    var colorIds = this.getColorIdsFromGrid();
    colorIds.sort(this.compareWeighted);
    var newState = { ...this.state };
    newState = this.refillRows(newState, colorIds);
    newState.sortedMode = true;
    newState.recomputed = false;
    this.setState(newState);
  }
  
  // **************** recompute weights according to user modified sort. ************

  recomputeWeights = () => {
    // Assemble array of rbg of colors in user order.
    // Only do this if the palette has been totally sorted.
    // Todo: some kind of error handling that can be displayed to the user.
    // Using all of these flags in state is very bad style.
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

  // ************** Palette stuff **************

  transformRGBtoHueChroma = (colorId) => {
    var colorRGB = this.state.colors[colorId];
    var red = colorRGB.color[1]/255;
    var green = colorRGB.color[2]/255;
    var blue = colorRGB.color[3]/255;
    if (red === green && red === blue) return [];
    var alpha = 0.5 * (2 * red - green - blue);
    var beta = sqrt(3) * 0.5 * (green - blue);
    
    var hueChroma = {
      colorId: colorRGB.id,
      hue: Math.atan2(alpha, beta),
      chroma: Math.sqrt(alpha * alpha + beta * beta),
      lightness: this.state.rWeight * red + this.state.gWeight * green + this.state.bWeight * blue,
    };

    // TODO: Understand why I have to return an array.
    return [hueChroma];
  }

  gray = (colorId) => {
    return ((this.state.colors[colorId].color[1] === this.state.colors[colorId].color[2]) &&
            (this.state.colors[colorId].color[1] === this.state.colors[colorId].color[3]));
  }
  
  getGraysOnly = (colorId) => {
    // If R, G and B are the same, we can't compute hue.
    if (this.gray(colorId) === true) {
          return [colorId];
        }
    return [];
  }

  matchColors = () => {
    // Let's not add another bunch of stuff to fillPalette.
    // Separate grays and colors.
    const colors = [];
    const grays = [];
    this.state.palettes['personal'].colorIds.forEach(colorId => {
      if (this.gray(colorId))
        grays.push(colorId);
      else
        colors.push(colorId);
    });
    let colorSchemeIdArray = [];
    var sortableArray = this.getColorIdsFromGrid();
    if (colors.length > 0) {
      // Get hue+chroma for start colors
      const startHueChroma = [];
      // Somehow it's a problem that transformRGBtoHueChroma returns [hueChroma] here
      // But the rest of the code doesn'n\t work when it returns hueChroma not in bracekets.
      // Maybe it's the use of flatMap. I could be using filter.
      colors.forEach(colorId => startHueChroma.push(this.transformRGBtoHueChroma(colorId)[0]));
      // Get hue+chroma from the big grid
      var hueChromaArray = sortableArray.flatMap(this.transformRGBtoHueChroma);
      colorSchemeIdArray = matchPaletteColors(startHueChroma, hueChromaArray);
    }
    if (grays.length > 0) {
      // Just add a bunch of grays.
      const grayIds = this.getSomeGrays(grays[0], sortableArray);
      grayIds.forEach(grayId => colorSchemeIdArray.push(grayId));
      // TODO: We might have more than nine colors now.
    }
    this.updateWithNewScheme(colorSchemeIdArray);
  }

  addOneColor = () => {
    // Let's not add another bunch of stuff to fillPalette.
    // Separate grays and colors.
    const colors = [];
    const grays = [];
    this.state.palettes['personal'].colorIds.forEach(colorId => {
      if (this.gray(colorId))
        grays.push(colorId);
      else
        colors.push(colorId);
    });
    let colorSchemeIdArray = [];
    var sortableArray = this.getColorIdsFromGrid();
    if (colors.length > 0) {
      // Get hue+chroma for start colors
      const startHueChroma = [];
      colors.forEach(colorId => startHueChroma.push(this.transformRGBtoHueChroma(colorId)[0]));
      // Get hue+chroma from the big grid
      var hueChromaArray = sortableArray.flatMap(this.transformRGBtoHueChroma);
      colorSchemeIdArray = expandPaletteColors(startHueChroma, hueChromaArray);
    }
    // TODO: We will have more than nine colors if we add gray here.
    if (grays.length > 0) {
      // Just add a bunch of grays.
      const grayIds = this.getSomeGrays(grays[0], sortableArray);
      grayIds.forEach(grayId => colorSchemeIdArray.push(grayId));
    }
    this.updateWithNewScheme(colorSchemeIdArray);
  }

  // When we take the palette colors out of the grid, we should preserve grid order.
  getColorIdsFromGrid = () => {
    var gridColorIds = [];
    var pOrder = this.state.paletteOrder;
    for (var i = 0; i < pOrder.length; i++) {
      gridColorIds = gridColorIds.concat(this.state.palettes[pOrder[i]].colorIds);
    }
    return gridColorIds;
  }

  getSomeGrays = (startColorId, sortableArray) => {
      // just get gray and sort by lightness.
      var grays = sortableArray.flatMap(this.getGraysOnly);
      // Append the start id - sortable is only main grid.
      grays.push(startColorId);
      grays.sort(this.compareWeighted);
      const colorSchemeIdArray = [];
      var oddEven = grays.indexOf(startColorId) % 2;
      for (var i = 0; i < grays.length; i++) {
        if ((i+oddEven) % 2 === 0)
        colorSchemeIdArray.push(grays[i]);
      }
      return colorSchemeIdArray;
  }
  /* TODO: code for match. Need to make a different function actually. */
  
  fillPalette = (how) => {
    // Compute an analogous color scheme.
    var startColorId = this.state.palettes['personal'].colorIds[0];
    // First map the color array into an array of structures sortable by color wheel angle.
    var sortableArray = this.getColorIdsFromGrid();

    // Better check for gray first. Can't compute hueChroma for gray.
    if (this.gray(startColorId) === false) {
      var hueChromaArray = sortableArray.flatMap(this.transformRGBtoHueChroma);
      var startHueChroma = this.transformRGBtoHueChroma(startColorId);
      var colorSchemeIdArray = getColorScheme(startHueChroma[0], hueChromaArray, how);
      // colorSchemeArray contains ids of colors that match according to "how."
    }
    else {
      colorSchemeIdArray = this.getSomeGrays(startColorId, sortableArray);
    }

    this.updateWithNewScheme(colorSchemeIdArray);
    this.toggleDropdown();
  }
  
  updateWithNewScheme = (newPersonalPaletteIds) => {

    // Remove color scheme colors from the grid rows and put them in the personal palette.
    var gridColorIds = this.getColorIdsFromGrid();
    this.removeColorsFromArray(newPersonalPaletteIds, gridColorIds);

    // Initialize a new state, copy of the old with rows refilled.
    var newRowsState = { ...this.state };
    newRowsState = this.refillRows(newRowsState, gridColorIds);

    // Create a new personal palette
    var newPalette = {
      ...newRowsState.palettes['personal'],
      colorIds: newPersonalPaletteIds,
    };

    // Final new state has the diminshed rows and filled personal palette.
    var newState = {
      ...newRowsState,
      palettes: {
        ...newRowsState.palettes,
        [newPalette.id]: newPalette,
      },
    }
    this.setState(newState);
  }

  // Clear the personal palette. Put the colors from it into the first row.
  
  clearPersonalPalette = () => {
    // Concatenate all the grid colors.
    const gridColorIds = this.getColorIdsFromGrid();
    // Prepend personal palette to grid ids
    const allColorIds = this.state.palettes["personal"].colorIds.concat(gridColorIds);
    // console.log(allColorIds);
    var newState = { ...this.state };
    var newPalette = {
      ...newState.palettes['personal'],
      colorIds: [],
    };
    newState.palettes[newPalette.id] = newPalette;
    newState = this.refillRows(newState, allColorIds);
    newState.sortedMode = false;
    newState.recomputed = false;
    this.setState(newState);
  }

  toggleDropdown = () => {
    this.setState({dropdownOn: !this.state.dropdownOn});
  }

  // Always render the personal palette.
  // Use the paletteOrder array to render any other palettes.

  render() {
    return (
    <div className="App">
      <header className="App-header">
        <h1>Personal Palette Assistant</h1>
        <div className="App-description">
          <h3>Double click or drag a chip to move colors between the grid and the palette.</h3>
          <h3>When there are one, two or three colors in the palette, you can expand the palette.</h3>
          <h3>Copy the palette to the clipboard to save it.</h3> 
        </div>
      </header>
      <div>
        <DragDropContext
          onDragEnd = {this.onDragEnd}>
          <Palette
            key={'personal'}
            palette={this.state.palettes['personal']}
            colorArray={this.state.palettes['personal'].colorIds.map(colorId => this.state.colors[colorId])}
            togglePalette={this.togglePalette}
          />
          { this.state.palettes['personal'].colorIds.length===1 &&
                <div className="ColorSchemeDropdown">
                  <button className="ColorSchemeDropbtn" onClick={this.toggleDropdown}>
                    Choose a Color Scheme
                  </button>
                  <div className="dropdown-content" style={{ display: this.state.dropdownOn ? "flex" : "none" }}>
                    <button className="SchemeButton" onClick={() => this.fillPalette("monochrome")}>
                      Monochromatic
                    </button>
                    <button className="SchemeButton" onClick={() => this.fillPalette("analogous")}>
                      Analogous
                    </button>
                    <button className="SchemeButton" onClick={() => this.fillPalette("complementary")}>
                      Complementary
                    </button>
                    <button className="SchemeButton" onClick={() => this.fillPalette("tertiary")}>
                      Tertiary
                    </button>
                    <button className="SchemeButton" onClick={() => this.fillPalette("square")}>
                      Square
                    </button>
                    <button className="SchemeButton" onClick={() => this.fillPalette("split")}>
                      Split Complementary
                    </button>
                    <button className="SchemeButton" onClick={() => this.fillPalette("rainbow")}>
                      Rainbow
                    </button>
                  </div>
              </div>
          }
          { this.state.palettes['personal'].colorIds.length===2 &&
              <div className="ButtonRow">
                <button className="SortButton" onClick={this.clearPersonalPalette}>
                  Clear
                </button>
                <button className="SortButton" onClick={this.matchColors}>
                  Two Colors
                </button>
                <button className="SortButton" onClick={this.addOneColor}>
                  Three Colors
                </button>
              </div>
          }
          { this.state.palettes['personal'].colorIds.length===3 &&
              <div className="ButtonRow">
                <button className="SortButton" onClick={this.clearPersonalPalette}>
                  Clear
                </button>
                <button className="SortButton" onClick={this.matchColors}>
                  Three Colors
                </button>
              </div>
          }
          { this.state.palettes['personal'].colorIds.length>3 &&
              <div className="ButtonRow">
                <button className="SortButton" onClick={this.clearPersonalPalette}>
                  Clear
                </button>
              </div> }
          <div className="SortDescriptionContainer">
            <div className="SortDescription">
              <h3>Sorted colors are grouped by hue and sorted by perceived lightness.</h3>
              <h3>Perceived lightness is computed as 0.299 red + 0.587 green + 0.114 blue.</h3>
              {/* <h3>If you think you can come up with a better order, move the chips around and select "Recompute" to compute new coefficients.</h3> */}
            </div>
          </div>
          <div className="ButtonRow">
            <button className="SortButton" onClick={this.resetHTML}>
              Reset HTML
            </button>
            <button className="SortButton" onClick={this.randomSet}>
              Reset Random
            </button>
            <button className="SortButton" onClick={() => this.sort(sortRGB)}>
              Sort RGB
            </button>
            <button className="SortButton" onClick={() => this.sort(sortCMYK)}>
              Sort CMYK
            </button>
            <button className="SortButton" onClick={() => this.sort(sort6)}>
              Six colors
            </button>
            <button className="SortButton" onClick={this.sortLightToDark}>
              Sort Light
            </button>
            {/* <button className="SortButton" onClick={this.recomputeWeights}> */}
              {/* Recompute */}
            {/* </button> */}
          </div>
          <Recomputed sorted={this.state.sortedMode} computed={this.state.recomputed} weights={this.state.newWeights}
                      rw={this.state.rWeight} gw={this.state.gWeight} bw={this.state.bWeight} />
          {this.state.paletteOrder.map(paletteId => {
            const palette = this.state.palettes[paletteId];
            const colorArray = palette.colorIds.map(colorId => this.state.colors[colorId]);
            return <Palette key={palette.id}
                            palette={palette}
                            colorArray={colorArray}
                            togglePalette={this.togglePalette}/>
          })}
        </DragDropContext>
      </div>
    </div>
    )
  }
}

export default App;
