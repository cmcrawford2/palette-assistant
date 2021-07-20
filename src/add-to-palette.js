import { round } from "mathjs";
import { matchPaletteColors } from "./match-palette.js";

function getOpposite (index, nColors) {
  let opposite = round(index + 0.5 * nColors);
  if (opposite >= nColors) opposite -= nColors;
  return opposite;
}

function addPaletteColors(nToAdd, startHueChroma, hueChromaArray, colors) {
  // Inputting nToAdd to add two colors to two existing colors.
  // May change this to make it more general. They will just be opposites.
  // First sort hueChromaArray by hue. Add the start ones to the array first.

  const allHueChromas = hueChromaArray.concat(startHueChroma);
  allHueChromas.sort((a,b) => b.hue - a.hue);

  // Find where the start colors are in the hue order.
  // This is called when there are two colors in the personal palette. If one is gray then there's only one start color.

  const index0 = allHueChromas.indexOf(startHueChroma[0]);
  const index1 = allHueChromas.indexOf(startHueChroma[1]);

  const n_HCs = allHueChromas.length;

  let newHueChromas = [];

  if (nToAdd === 1) {
    let average = round(0.5 * (index0 + index1));
    // This will be split complementary scheme with inputs being the split.
    // If inputs are separated by more than n_HC/2, the complement is the average.
    // Otherwise the complement is the opposite of the average.
    if (Math.abs(index0 - index1) < n_HCs / 2)
      average = getOpposite(average, n_HCs);
    newHueChromas = [
      startHueChroma[0],
      allHueChromas[average],
      startHueChroma[1]
    ];
  } else {
    // Draw the output in the order of new color that is next to 0 (opposite of 1),
    // color 0, color 1, new color that is next to 1 (opposite of 0).
    newHueChromas = [
      allHueChromas[getOpposite(index1, n_HCs)],
      startHueChroma[0],
      startHueChroma[1],
      allHueChromas[getOpposite(index0, n_HCs)]
    ];
  }

  return matchPaletteColors(3, newHueChromas, hueChromaArray, colors);
}

export default addPaletteColors;