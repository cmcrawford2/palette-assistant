import { round } from "mathjs";
import { min } from "mathjs";
import matchPaletteColors from "./match-aplette.js";

function expandPaletteColors(startHueChroma, hueChromaArray) {

  // First sort hueChromaArray by hue. Add the start ones to the array first.

  const allHueChromas = hueChromaArray.concat(startHueChroma);
  allHueChromas.sort((a,b) => b.hue - a.hue);

  // Find where the start colors are in the hue order.
  // This is called when there are two colors in the personal palette. If one is gray then there's only one start color.

  const startIndices = [];
  startHueChroma.forEach(hueChroma => startIndices.push(allHueChromas.indexOf(hueChroma)));

  const average = (startHueChroma.length === 1) ? startIndices[0] : round(0.5 * (startIndices[0] + startIndices[1]));
  const opposite = round(average + 0.5 * allHueChromas.length);
  startIndices.push(opposite);

  // Find neighbors of all the input hueChromas.
  const neighborIndices = [];
  startIndices.forEach((index) => {
    for (let ni = index - 4; ni < index + 5; ni++) {
      // check because there may be overlap.
      if (neighborIndices.indexOf(ni) === -1)
        neighborIndices.push(ni);
    }
  });

  // Relying on the knowledge that length is 2 or 3. Could be less if there are grays.
  const max_length = (startIndices.length === 2) ? 10 : 9;

  // We want at most nine colors.
  const nColors = min(neighborIndices.length, max_length);

  const interval = (neighborIndices.length > nColors) ? neighborIndices.length / nColors : 1;
  const newPalette = [];

  for (let ii = 0; ii < nColors; ii++) {
    const indexIndex = round(ii * interval);
    let colorIndex = neighborIndices[indexIndex];
    // The color wheel wraps around from n-1 to 0. Adjust.
    if (colorIndex < 0) colorIndex += allHueChromas.length;
    else if (colorIndex >= allHueChromas.length) colorIndex -= allHueChromas.length;
    newPalette[ii] = allHueChromas[colorIndex].colorId;
  }
  return newPalette;
}

export default expandPaletteColors;