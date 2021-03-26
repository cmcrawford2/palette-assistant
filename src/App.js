import React from "react";
import colorArray from "./color-file.js";
import "./App.css";

// Using relative luminance https://planetcalc.com/7779/
const gWeight = 0.587;
const rWeight = 0.299;
const bWeight = 0.114;

class App extends React.Component {
  // Initialize the state with a 2d array.
  // 147 rows, each row a color name and decimal rgb values.
  state = { colors: colorArray };

  compareLightness = (color1, color2) => {
    // From wikipedia - doesn't really do it for me.
    var XMax1 = Math.max(color1[1], color1[2], color1[3]);
    var XMin1 = Math.min(color1[1], color1[2], color1[3]);
    var XMax2 = Math.max(color2[1], color2[2], color2[3]);
    var XMin2 = Math.min(color2[1], color2[2], color2[3]);
    return (XMax2 + XMin2) - (XMax1 + XMin1);
  }

  compareWeighted = (color1, color2) => {
    return (rWeight * (color2[1] * color2[1] - color1[1] * color1[1]) +
            gWeight * (color2[2] * color2[2] - color1[2] * color1[2]) +
            bWeight * (color2[3] * color2[3] - color1[3] * color1[3]));
  }

  sortRGB = () => {
    var grays = [];
    var reds = [];
    var greens = [];
    var blues = [];
    for (var i = 0; i < this.state.colors.length; i++) {
      var color = this.state.colors[i];
      var r = color[1];
      var g = color[2];
      var b = color[3];
      if (r == g && r == b) {
        grays.push(color);
      }
      else if (r >= g && r > b) {
        reds.push(color);
      }
      else if (g >= b && g > r) {
        greens.push(color);
      }
      else { // b >= r && b > g
        blues.push(color);
      }
    }
    grays.sort(this.compareWeighted);
    reds.sort(this.compareWeighted);
    greens.sort(this.compareWeighted);
    blues.sort(this.compareWeighted);
    var sortedColors = reds.concat(greens, blues, grays);
    this.setState({ colors: sortedColors });
  }

  sortCMYK = () => {
    var cyans = [];
    var magentas = [];
    var yellows = [];
    var grays = [];
    for (var i = 0; i < this.state.colors.length; i++) {
      var color = this.state.colors[i];
      var r = color[1];
      var g = color[2];
      var b = color[3];
      if (r == g && r == b) {
        grays.push(color);
      }
      else if (r < g && r <= b) {
        cyans.push(color);
      }
      else if (g <= b && g <= r) {
        magentas.push(color);
      }
      else { // b < r && b < g
        yellows.push(color);
      }
    }
    grays.sort(this.compareWeighted);
    cyans.sort(this.compareWeighted);
    magentas.sort(this.compareWeighted);
    yellows.sort(this.compareWeighted);
    var sortedColors = cyans.concat(magentas, yellows, grays);
    this.setState({ colors: sortedColors });
  }

  sort6 = () => {
    var reds = [];
    var greens = [];
    var blues = [];
    var cyans = [];
    var magentas = [];
    var yellows = [];
    var grays = [];
    for (var i = 0; i < this.state.colors.length; i++) {
      var color = this.state.colors[i];
      // Take out the darkest value to sort into buckets.
      var darkest = Math.min(color[1], color[2], color[3]);
      var r = color[1] - darkest;
      var g = color[2] - darkest;
      var b = color[3] - darkest;
      if (r == g && r == b) {
        grays.push(color);
      }
      else if (r >= 2*b && r >= 2*g) {
        reds.push(color);
      }
      else if (b >= 2*g && b >= 2*r) {
        blues.push(color);
      }
      else if (g >= 2*r && g >= 2*b) {
        greens.push(color);
      }
      else if (r > b && g > b && r < 2*g && g < 2*r) {
        yellows.push(color);
      }
      else if (b > g && r > g && b < 2*r && r < 2*b) {
        magentas.push(color);
      }
      else if (g > r && b > r && g < 2*b && b < 2*g) {
        cyans.push(color);
      }
    }
    reds.sort(this.compareWeighted);
    greens.sort(this.compareWeighted);
    blues.sort(this.compareWeighted);
    cyans.sort(this.compareWeighted);
    magentas.sort(this.compareWeighted);
    yellows.sort(this.compareWeighted);
    grays.sort(this.compareWeighted);
    var sortedColors = reds.concat(yellows, greens, cyans, blues, magentas, grays);
    this.setState({ colors: sortedColors });
  }

  sortLightToDark = () => {
    var colorCopy = this.state.colors;
    colorCopy.sort(this.compareWeighted);
    this.setState({ colors: colorCopy })
  }

  getHex = (color) => {
    var hexStr = "#";
    if (color[1] < 16) hexStr += "0";
    hexStr += color[1].toString(16);
    if (color[2] < 16) hexStr += "0";
    hexStr += color[2].toString(16);
    if (color[3] < 16) hexStr += "0";
    hexStr += color[3].toString(16);
    return hexStr;
  }

  colorAsChip = (color) => {
    // var rgbString = "rgb(" + color[1] + ", " + color[2] + ", " + color[3] + ")";
    var hexString = this.getHex(color);
    var textColor = 'black';
    if (rWeight*color[1] + gWeight*color[2] + bWeight*color[3] < 100) textColor = 'white';
    return (
      <div
        className="ColorChip"
        style={{ backgroundColor: color[0], color: textColor }}
      >
        <p>{color[0]}</p>
        <p>{hexString}</p>
      </div>
    );
  };

  renderColorChips = () => {
    // This function renders the color chips in the order they appear in state.
    return this.state.colors.map(this.colorAsChip);
  };

  render() {
    return (
    <div className="App">
      <header className="App-header">
        <h1>Personal Palette Assistant</h1>
      </header>
      <body>
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
        <div className="RowOfChips">{this.renderColorChips()}</div>
      </body>
    </div>
    )
  }
}

export default App;
