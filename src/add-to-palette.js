import { round } from "mathjs";
import { expandPaletteColors } from "./match-palette.js";

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
  // Some hues are the same. Make sure we always start with the same array.
  allHueChromas.sort((a,b)=>b.hue - a.hue);

  // const hcIds = allHueChromas.map(hc => hc.colorId);
  // for (let i = 0; i < hcIds.length; i++)
  //   console.log(allHueChromas[i].colorId,allHueChromas[i].hue);
    
  // Find where the start colors are in the hue order.
  // This is called when there are two colors in the personal palette. If one is gray then there's only one start color.

  const index0 = allHueChromas.indexOf(startHueChroma[0]);
  const index1 = allHueChromas.indexOf(startHueChroma[1]);

  const n_HCs = allHueChromas.length;

  let startInds = [];

  if (nToAdd === 1) {
    let average = round(0.5 * (index0 + index1));
    // This will be split complementary scheme with inputs being the split.
    // If inputs are separated by more than n_HC/2, the complement is the average.
    // Otherwise the complement is the opposite of the average.
    if (Math.abs(index0 - index1) < n_HCs / 2) {
      average = getOpposite(average, n_HCs);
    }
    startInds = [index0, average, index1];
  } else {
    // Draw the output in the order of new color that is next to 0 (opposite of 1),
    // color 0, color 1, new color that is next to 1 (opposite of 0).
    const opposite0 = getOpposite(index0, n_HCs);
    const opposite1 = getOpposite(index1, n_HCs);
    startInds = [opposite1, index0, index1, opposite0];
  }

  return expandPaletteColors(3, startInds, allHueChromas, colors);
}

export default addPaletteColors;