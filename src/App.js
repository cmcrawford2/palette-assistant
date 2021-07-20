import React from "react";
import initialData from './initial_data.js'
import { DragDropContext } from 'react-beautiful-dnd';
import Palette from './palette.js'
import { getGrays, getColorScheme } from './color-scheme.js'
import { matchPaletteColors } from './match-palette.js'
import addPaletteColors from './expand-palette.js'
import { getWeights, sortRGB, sortCMYK, sort6, isGray, RGBtoHex, RGBtoHueChroma } from './sort-colors.js'
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
        prevState: null,
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

  // ************** Palette stuff **************

  // When we take the palette colors out of the grid, we should preserve grid order.
  getColorIdsFromGrid = () => {
    var gridColorIds = [];
    var pOrder = this.state.paletteOrder;
    for (var i = 0; i < pOrder.length; i++) {
      gridColorIds = gridColorIds.concat(this.state.palettes[pOrder[i]].colorIds);
    }
    return gridColorIds;
  }  

  // Color chips should not appear in more than one place. Drag and Drop requires all the "droppables" to have unique ids.
  // so before we reformat the grid using a button function, we need to remove any color that has been placed in the personal palette.
  removeColorsFromArray = (removeIds, colorIds) => {
    // Remove any chips that are in the personal palette.
    for (var i = 0; i < removeIds.length; i++) {
      // remove this id from the colorIds array.
      var c_i = colorIds.indexOf(removeIds[i]);
      if (c_i >= 0)
        colorIds.splice(c_i, 1);
    }
  }

  fillPalette = (how) => {
    // Compute a color scheme depending on string "how."
    const startColorId = this.state.palettes['personal'].colorIds[0];
    // First map the color array into an array of structures sortable by color wheel angle.
    const colorIdArray = this.getColorIdsFromGrid();

    // Better check for gray first. Can't compute hueChroma for gray.
    if (!isGray(this.state.colors[startColorId])) {
      const allColors = colorIdArray.filter(colorId => !isGray(this.state.colors[colorId]))
      var hueChromaArray = allColors.map(color_id => RGBtoHueChroma(this.state.colors[color_id]));
      var startHueChroma = RGBtoHueChroma(this.state.colors[startColorId]);
      var colorSchemeIdArray = getColorScheme(startHueChroma, hueChromaArray, this.state.colors, how);
    }
    else {
      const startGrays = [];
      startGrays.push(startColorId);
      colorSchemeIdArray = getGrays(7, startGrays, colorIdArray.concat(startColorId), this.state.colors);
    }

    this.updateWithNewScheme(colorSchemeIdArray);
    this.toggleDropdown();
  }

  matchColors = () => {
    // More than one color - at this time can be up to 6.
    // Separate grays and colors.
    const colors = [];
    const grays = [];
    this.state.palettes['personal'].colorIds.forEach(colorId => {
      if (isGray(this.state.colors[colorId]))
        grays.push(colorId);
      else
        colors.push(colorId);
    });
    const n_palette = colors.length + grays.length;
    const n_each = (n_palette === 2) ? 4 : ((n_palette <= 4) ? 3 : 2);
    let colorSchemeIdArray = [];
    var colorIdArray = this.getColorIdsFromGrid();
    if (colors.length > 0) {
      // Get hue+chroma for start colors
      const startHueChroma = [];
      colors.forEach(colorId => startHueChroma.push(RGBtoHueChroma(this.state.colors[colorId])));
      // Get hue+chroma from the big grid
      const allColors = colorIdArray.filter(color_id => !isGray(this.state.colors[color_id]))
      var hueChromaArray = allColors.map(color_id => RGBtoHueChroma(this.state.colors[color_id]));
      colorSchemeIdArray = matchPaletteColors(n_each, startHueChroma, hueChromaArray, this.state.colors);
    }
    if (grays.length > 0) {
      // Add three chips per gray.
      const grayIds = getGrays(n_each * grays.length, grays, colorIdArray.concat(grays), this.state.colors);
      grayIds.forEach(grayId => colorSchemeIdArray.push(grayId));
    }
    this.updateWithNewScheme(colorSchemeIdArray);
  }

  addColors = (nToAdd) => {
    // This function assumes two inputs, not gray, with one or two colors added.
    console.table(this.state.palettes['personal']);
    if ((this.state.palettes['personal'].colorIds.length) !== 2 || nToAdd < 1 || nToAdd > 2)
      return;
    const id1 = this.state.palettes['personal'].colorIds[0];
    const id2 = this.state.palettes['personal'].colorIds[1];
    const color1 = this.state.colors[id1];
    const color2 = this.state.colors[id2];
    console.log({id1, id2});
    console.log({color1, color2});
    // Nothing to compute if one or both colors are gray.
    if (isGray(color1) || isGray(color2))
      return this.matchColors();

    let colorSchemeIdArray = [];
    var colorIdArray = this.getColorIdsFromGrid();
    // Get hue+chroma for start colors
    const startHueChroma = [RGBtoHueChroma(color1), RGBtoHueChroma(color2)];
    // Get hue+chroma from the big grid
    const allColors = colorIdArray.filter(color_id => !isGray(this.state.colors[color_id]));
    const hueChromaArray = allColors.map(color_id => RGBtoHueChroma(this.state.colors[color_id]));
    colorSchemeIdArray = addPaletteColors(nToAdd, startHueChroma, hueChromaArray, this.state.colors);
    this.updateWithNewScheme(colorSchemeIdArray);
  }

  updateWithNewScheme = (newPersonalPaletteIds) => {

    // Remove color scheme colors from the grid rows and put them in the personal palette.
    var gridColorIds = this.getColorIdsFromGrid();
    this.removeColorsFromArray(newPersonalPaletteIds, gridColorIds);

    // Initialize a new state, copy of the old with rows refilled.
    var newRowsState = { ...this.state };
    newRowsState.prevPalette = [...this.state.palettes['personal'].colorIds];
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

  // Restore stored state.

  restorePrevPalette = () => {
    // Concatenate all the grid colors.
    const gridColorIds = this.getColorIdsFromGrid();
    // Prepend personal palette to grid ids
    const allColorIds = this.state.palettes["personal"].colorIds.concat(gridColorIds);
    // Must also remove previous palette colors from grid as we are restoring it.
    this.removeColorsFromArray(this.state.prevPalette, allColorIds);
    var newState = { ...this.state };
    var newPalette = {
      ...newState.palettes['personal'],
      colorIds: this.state.prevPalette,
      prevPalette: [],
    };
    newState.palettes[newPalette.id] = newPalette;
    newState = this.refillRows(newState, allColorIds);
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
    this.setState(newState);
  }

  // Generate a random set of colors
  
  randomSet = () => {
    // This function makes a new grid of 100 random colors.
    // It also clears the personal palette.

    // Make a copy of state that we will modify directly.
    var newState = { ...this.state };
    newState.randomMode = true;

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
      var colorName = RGBtoHex(r, g, b);
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
    // Refill the rows and the row palette id lists.
    newState = this.refillRows(newState, colorIds);
    // Rest the personal palette to be empty.
    newState.palettes['personal'].colorIds = [];
    this.setState(newState);
  }

  // ********** Sorting stuff ************

  compareLightness = (colorId1, colorId2) => {
    // From wikipedia - doesn't really do it for me.
    var color1 = this.state.colors[colorId1];
    var color2 = this.state.colors[colorId2];
    var XMax1 = Math.max(color1.color[1], color1.color[2], color1.color[3]);
    var XMin1 = Math.min(color1.color[1], color1.color[2], color1.color[3]);
    var XMax2 = Math.max(color2.color[1], color2.color[2], color2.color[3]);
    var XMin2 = Math.min(color2.color[1], color2.color[2], color2.color[3]);
    return (XMax2 + XMin2) - (XMax1 + XMin1);
  }

  compareWeighted = (colorId1, colorId2) => {
    var color1 = this.state.colors[colorId1];
    var color2 = this.state.colors[colorId2];
    const [gWeight, rWeight, bWeight] = getWeights();
    return (rWeight * (color2.color[1] - color1.color[1]) +
            gWeight * (color2.color[2] - color1.color[2]) +
            bWeight * (color2.color[3] - color1.color[3]));
  }

  sort = (sortByGroup) => {
    // SortByGroup function subdivides by color group before sorting.
    // Can by by RGB, CMYK, or both (sort6).
    var colorIds = this.getColorIdsFromGrid();
    var sortedIds = sortByGroup(this.state.colors, colorIds, this.compareWeighted);
    var newState = { ...this.state };
    newState = this.refillRows(newState, sortedIds);
    this.setState(newState);
  }

  sortLightToDark = () => {
    var colorIds = this.getColorIdsFromGrid();
    colorIds.sort(this.compareWeighted);
    var newState = { ...this.state };
    newState = this.refillRows(newState, colorIds);
    this.setState(newState);
  }
  
  toggleDropdown = () => {
    this.setState({dropdownOn: !this.state.dropdownOn});
  }

  toggleGridDropdown = () => {
    this.setState({gridDropdownOn: !this.state.gridDropdownOn});
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
              <div className="DropdownWrapper">
                <button className="DropName" onClick={this.toggleDropdown}>
                  Choose a Color Scheme
                </button>
                <div className="DropdownContent" style={{ display: this.state.dropdownOn ? "flex" : "none" }}>
                  <button className="DropItem" onClick={() => this.fillPalette("monochrome")}>
                    Monochromatic
                  </button>
                  <button className="DropItem" onClick={() => this.fillPalette("analogous")}>
                    Analogous
                  </button>
                  <button className="DropItem" onClick={() => this.fillPalette("complementary")}>
                    Complementary
                  </button>
                  <button className="DropItem" onClick={() => this.fillPalette("tertiary")}>
                    Tertiary
                  </button>
                  <button className="DropItem" onClick={() => this.fillPalette("square")}>
                    Square
                  </button>
                  <button className="DropItem" onClick={() => this.fillPalette("split")}>
                    Split Complementary
                  </button>
                  <button className="DropItem" onClick={() => this.fillPalette("rainbow")}>
                    Rainbow
                  </button>
                </div>
              </div>
          }
          { this.state.palettes['personal'].colorIds.length===2 &&
              <div className="ButtonRow">
                <button className="SortButton" onClick={this.matchColors}>
                  Expand Colors
                </button>
                <button className="SortButton" onClick={() => {this.addColors(1)}}>
                  Add One Color
                </button>
                <button className="SortButton" onClick={() => {this.addColors(2)}}>
                  Add Two Colors
                </button>
                <button className="SortButton" onClick={this.clearPersonalPalette}>
                  Clear
                </button>
              </div>
          }
          { this.state.palettes['personal'].colorIds.length >= 3 &&
            this.state.palettes['personal'].colorIds.length <= 6 &&
              <div className="ButtonRow">
                <button className="SortButton" onClick={this.matchColors}>
                  Expand Colors
                </button>
                <button className="SortButton" onClick={this.clearPersonalPalette}>
                  Clear
                </button>
              </div>
          }
          { this.state.palettes['personal'].colorIds.length>6 &&
              <div className="ButtonRow">
                <button className="SortButton" onClick={this.restorePrevPalette}>
                  Back
                </button>
                <button className="SortButton" onClick={this.clearPersonalPalette}>
                  Clear
                </button>
              </div> }
          <div className="SortDescriptionContainer">
            <div className="SortDescription">
              <h3>Sorted colors are grouped by hue and sorted by perceived lightness.</h3>
              {/* <h3>Perceived lightness is computed as 0.299 red + 0.587 green + 0.114 blue.</h3> */}
            </div>
          </div>
          <div className="DropdownWrapper">
            <button className="DropName" onClick={this.toggleGridDropdown}>
              Grid options
            </button>
            <div className="DropdownContent" style={{ display: this.state.gridDropdownOn ? "flex" : "none" }}>
              <button className="DropItem" onClick={this.resetHTML}>
                Reset Grid: HTML colors
              </button>
              <button className="DropItem" onClick={this.randomSet}>
                Reset Grid: Randomly
              </button>
              <button className="DropItem" onClick={() => this.sort(sortRGB)}>
                Sort RGB
              </button>
              <button className="DropItem" onClick={() => this.sort(sortCMYK)}>
                Sort CMYK
              </button>
              <button className="DropItem" onClick={() => this.sort(sort6)}>
                Six colors
              </button>
              <button className="DropItem" onClick={this.sortLightToDark}>
                Sort Light
              </button>
            </div>
          </div>
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
