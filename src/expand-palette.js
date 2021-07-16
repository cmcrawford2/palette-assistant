import { round } from "mathjs";
import matchPaletteColors from "./match-palette.js";

function expandPaletteColors(startHueChroma, hueChromaArray) {

  // First sort hueChromaArray by hue. Add the start ones to the array first.

  const allHueChromas = hueChromaArray.concat(startHueChroma);
  allHueChromas.sort((a,b) => b.hue - a.hue);

  // Find where the start colors are in the hue order.
  // This is called when there are two colors in the personal palette. If one is gray then there's only one start color.

  const startIndices = [];
  startHueChroma.forEach(hueChroma => startIndices.push(allHueChromas.indexOf(hueChroma)));

  const average = (startHueChroma.length === 1) ? startIndices[0] : round(0.5 * (startIndices[0] + startIndices[1]));
  const n_HCs = allHueChromas.length;
  let opposite = round(average + 0.5 * n_HCs);
  // console.log({average, opposite, n_HCs});

  if (opposite < 0) opposite += n_HCs;
  else if (opposite >= n_HCs) opposite -= n_HCs;

  startHueChroma.push(allHueChromas[opposite]);

  return matchPaletteColors(startHueChroma, hueChromaArray);
}

export default expandPaletteColors;