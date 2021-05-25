import { round } from "mathjs";

function getNearestNeighbors(startIndex, number, colorArray) {
  // startIndex should be negative, but startIndex + number can be > colorArray.length.
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

function getColorScheme (startHueChroma, hueChromaArray, how) {

// First sort hueChromaArray by hue. Add the start one to the array first.

  hueChromaArray.push(startHueChroma);
  if (how === "rainbow")
    hueChromaArray.sort((a,b) => b.chroma - a.chroma);
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
    // Make a little array out of the seven nearest neighbors to startIndex.
    startColors = getNearestNeighbors(startIndex-4, 9, hueChromaArray);
    // Find the index of start color in the little array
    var littleIndex = startColors.indexOf(startHueChroma);

    // Assume the array is evenly distributed around the color wheel.
    // For analogous color scheme, divide wheel into 12 sections.
    // Make little arrays out of the two sections adjacent to startIndex.
    var friend_i1 = round(startIndex - twelfth);
    var friend_i2 = round(startIndex + twelfth);

    var friend1Colors = getNearestNeighbors(friend_i1-4, 9, hueChromaArray);
    var friend2Colors = getNearestNeighbors(friend_i2-4, 9, hueChromaArray);

    // Get every third color out of the little arrays.

    var i0 = littleIndex % 3;
    newPalette = [friend1Colors[i0].colorId, friend1Colors[i0+3].colorId, friend1Colors[i0+6].colorId,
                  startColors[i0].colorId, startColors[i0 + 3].colorId, startColors[i0 + 6].colorId,
                  friend2Colors[i0].colorId, friend2Colors[i0 + 3].colorId, friend2Colors[i0 + 6].colorId];
  }
  else if (how === "complementary") {
    startColors = getNearestNeighbors(startIndex-6, 12, hueChromaArray);
    littleIndex = startColors.indexOf(startHueChroma);
    var complement_i = round(startIndex + n_colors/2);
    var complementColors = getNearestNeighbors(complement_i-6, 12, hueChromaArray);
    i0 = littleIndex % 3;
    newPalette = [startColors[i0].colorId, startColors[i0 + 3].colorId,
                  startColors[i0 + 6].colorId, startColors[i0 + 9].colorId,
                  complementColors[i0].colorId, complementColors[i0 + 3].colorId,
                  complementColors[i0 + 6].colorId, complementColors[i0 + 9].colorId];
  }
  else if (how === "tertiary") {
    startColors = getNearestNeighbors(startIndex-4, 9, hueChromaArray);
    littleIndex = startColors.indexOf(startHueChroma);
    friend_i1 = round(startIndex - 4*twelfth);
    friend_i2 = round(startIndex + 4*twelfth);
    friend1Colors = getNearestNeighbors(friend_i1 - 4, 9, hueChromaArray);
    friend2Colors = getNearestNeighbors(friend_i2 - 4, 9, hueChromaArray);

    // Get every third color out of the little arrays.

    i0 = littleIndex % 3;
    newPalette = [friend1Colors[i0].colorId, friend1Colors[i0 + 3].colorId, friend1Colors[i0 + 6].colorId,
                  startColors[i0].colorId, startColors[i0 + 3].colorId, startColors[i0 + 6].colorId,
                  friend2Colors[i0].colorId, friend2Colors[i0 + 3].colorId, friend2Colors[i0 + 6].colorId];

  }
  else if (how === "square") {
    startColors = getNearestNeighbors(startIndex - 3, 6, hueChromaArray);
    littleIndex = startColors.indexOf(startHueChroma);
    var i1 = round(startIndex + n_colors / 4);
    var i2 = round(startIndex + n_colors / 2);
    var i3 = round(startIndex + 3 * n_colors / 4);
    var i1Colors = getNearestNeighbors(i1 - 3, 6, hueChromaArray);
    var i2Colors = getNearestNeighbors(i2 - 3, 6, hueChromaArray);
    var i3Colors = getNearestNeighbors(i3 - 3, 6, hueChromaArray);
    i0 = littleIndex % 3;
    newPalette = [startColors[i0].colorId, startColors[i0 + 3].colorId,
                  i1Colors[i0].colorId, i1Colors[i0 + 3].colorId,
                  i2Colors[i0].colorId, i2Colors[i0 + 3].colorId,
                  i3Colors[i0].colorId, i3Colors[i0 + 3].colorId];
  }
  else if (how === "split") {
    startColors = getNearestNeighbors(startIndex - 4, 9, hueChromaArray);
    littleIndex = startColors.indexOf(startHueChroma);
    friend_i1 = round(startIndex + n_colors / 2 - twelfth);
    friend_i2 = round(startIndex + n_colors / 2 + twelfth);
    friend1Colors = getNearestNeighbors(friend_i1 - 4, 9, hueChromaArray);
    friend2Colors = getNearestNeighbors(friend_i2 - 4, 9, hueChromaArray);

    // Get every third color out of the little arrays.

    i0 = littleIndex % 3;
    newPalette = [friend1Colors[i0].colorId, friend1Colors[i0 + 3].colorId, friend1Colors[i0 + 6].colorId,
                  startColors[i0].colorId, startColors[i0 + 3].colorId, startColors[i0 + 6].colorId,
                  friend2Colors[i0].colorId, friend2Colors[i0 + 3].colorId, friend2Colors[i0 + 6].colorId];
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
  }
  return newPalette;
}

export default getColorScheme;