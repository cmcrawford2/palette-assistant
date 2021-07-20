import { isGray, getLightness } from './sort-colors.js'
import { expandPaletteColors } from './match-palette.js'

function getGrays(n_grays, startGrays, allIds, colorArray) {
    // Get all grays and sort by lightness.
    // Arbitrarily remove British English spelling.
    // If a "grey" is a start value, it will be placed in the array at the end.
    var grays = allIds.filter((color_id) =>
      isGray(colorArray[color_id]) &&
      colorArray[color_id].color[0].search("grey") === -1);

    grays.sort((a,b) => colorArray[b].color[1] - colorArray[a].color[1]);
    let grayIdArray = [];

    if (grays.length <= n_grays)
      grayIdArray = [...grays];
    else {
      // Choose a subset.
      const interval = grays.length / n_grays;
      for (var i = 0; i < n_grays; i++) {
        let index = Math.round(i * interval);
          grayIdArray.push(grays[index]);
      }
    }

    // Add the start grays if they didn't make it in.
    for (let i = 0; i < startGrays.length; i++) {
      let gray_i = startGrays[i];
      if (grayIdArray.indexOf(gray_i) === -1) {
        replaceNearestNeighbor(gray_i, grayIdArray, colorArray);
      }
    }

    return grayIdArray;
}

function replaceNearestNeighbor(startColorId, colorIdArray, colorArray) {
  const startColor = colorArray[startColorId];
  const startLightness = getLightness(startColor);

  let minDist, minIndex;
  for (let i = 0; i < colorIdArray.length; i++) {
    let color = colorArray[colorIdArray[i]];
    let colorLightness = getLightness(color);
    let dist = Math.abs(startLightness - colorLightness);
    if (i === 0 || dist < minDist) {
      minIndex = i;
      minDist = dist;
    }
  }
  colorIdArray[minIndex] = startColorId;
}

function getNearestNeighbors(startIndex, number, colorArray) {
  // startIndex could be negative, and startIndex + number could be > colorArray.length.
  // This function will adjust both cases. Similar colors may cross zero of the color wheel.
  var n_colors = colorArray.length;
  var subsetArray = [];
  if (startIndex < 0) {
    startIndex += n_colors;
  }
  for (var i = startIndex; i < startIndex + number; i++) {
    var color_i = i % n_colors;
    subsetArray.push(colorArray[color_i]);
  }
  // Sort light to dark - light is > dark.
  subsetArray.sort((a, b) => b.lightness - a.lightness);
  return subsetArray;
}

function adjustIndex(index, n_colors) {
  if (index < 0) return index + n_colors;
  if (index >= n_colors) return index - n_colors;
  return index;
}

function getColorScheme (startHueChroma, hueChromaArray, colors, how) {

// First sort hueChromaArray by hue. Add the start one to the array first.

  hueChromaArray.push(startHueChroma);
  if (how === "rainbow")
    hueChromaArray.sort((a,b) => b.lightness - a.lightness);
  else
    hueChromaArray.sort((a,b) => b.hue - a.hue);

  // Find where the start color is in the hue order.
  var startIndex = hueChromaArray.indexOf(startHueChroma);

  var n_colors = hueChromaArray.length;
  var twelfth = n_colors/12;
  var newPalette = [];

  if (how === "monochrome") {
    var startColors = getNearestNeighbors(startIndex-4, 9, hueChromaArray);
    for (var mi = 0; mi < 9; mi++) {
      newPalette.push(startColors[mi].colorId);
    }
  }
  else if (how === "analogous") {
    // Assume the array is evenly distributed around the color wheel.
    // For analogous color scheme, divide wheel into 12 sections.
    // Make little arrays out of the two sections adjacent to startIndex.
    var friend_i1 = adjustIndex(Math.round(startIndex - twelfth), n_colors);
    var friend_i2 = adjustIndex(Math.round(startIndex + twelfth), n_colors);
    const startInds = [friend_i1, startIndex, friend_i2];
    return expandPaletteColors(4, startInds, hueChromaArray, colors);
  }
  else if (how === "complementary") {
    var complement_i = adjustIndex(Math.round(startIndex + n_colors/2), n_colors);
    const startInds = [startIndex, complement_i];
    return expandPaletteColors(4, startInds, hueChromaArray, colors);
  }
  else if (how === "tertiary") {
    friend_i1 = adjustIndex(Math.round(startIndex - 4*twelfth), n_colors);
    friend_i2 = adjustIndex(Math.round(startIndex + 4*twelfth), n_colors);
    const startInds = [friend_i1, startIndex, friend_i2];
    return expandPaletteColors(4, startInds, hueChromaArray, colors);
  }
  else if (how === "square") {
    let i1 = adjustIndex(Math.round(startIndex + n_colors / 4), n_colors);
    let i2 = adjustIndex(Math.round(startIndex + n_colors / 2), n_colors);
    let i3 = adjustIndex(Math.round(startIndex + 3 * n_colors / 4), n_colors);
    const startInds = [startIndex, i1, i2, i3];
    return expandPaletteColors(3, startInds, hueChromaArray, colors);
  }
  else if (how === "split") {
    let split_i1 = adjustIndex(Math.round(startIndex + n_colors / 2 - twelfth), n_colors);
    let split_i2 = adjustIndex(Math.round(startIndex + n_colors / 2 + twelfth), n_colors);
    const startInds = [split_i1, startIndex, split_i2];
    return expandPaletteColors(4, startInds, hueChromaArray, colors);
  }
  else if (how === "rainbow") {
    var rainbowStart = startIndex - 12;
    if (rainbowStart < 0) rainbowStart = 0;
    else if (rainbowStart > n_colors-25) rainbowStart = n_colors-25;
    startColors = getNearestNeighbors(rainbowStart, 24, hueChromaArray);
    startColors.sort((a,b) => b.hue - a.hue);
    for (var ri = 0; ri < 12; ri++) {
      newPalette.push(startColors[2*ri].colorId);
    }
    // Make sure start is in the output.
    if (newPalette.indexOf(startHueChroma.colorId === -1)) {
      // Have to replace according to hue, so don't call replaceNearestNeighbor.
      let minDist, minIndex;
      for (ri = 0; ri < 12; ri++) {
        let hueChroma = startColors[2*ri];
        let dist = Math.abs(startHueChroma.hue - hueChroma.hue);
        if (ri === 0 || dist < minDist) {
          minIndex = ri;
          minDist = dist;
        }
      }
      newPalette[minIndex] = startHueChroma.colorId;
    }
  }

  return newPalette;
}

export { getGrays, replaceNearestNeighbor, getColorScheme };