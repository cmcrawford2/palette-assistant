import { round } from "mathjs";
import { floor } from "mathjs";
import { min } from "mathjs";
import { max } from "mathjs";

function matchPaletteColors(startHueChroma, hueChromaArray) {

  // First sort hueChromaArray by hue. Add the start ones to the array first.
  const allHueChromas = hueChromaArray.concat(startHueChroma);
  allHueChromas.sort((a,b) => b.hue - a.hue);

  // Find where the start colors are in the hue order.
  const startIndices = [];
  startHueChroma.forEach((hueChroma, index) =>
    startIndices.push({hcIndex: allHueChromas.indexOf(hueChroma),
                       siIndex: index}));

  // Sort in numerical order to set up non-overlapping ranges.
  startIndices.sort((a,b) => a.hcIndex - b.hcIndex);
  console.table(startIndices);
  // For each starting color, choose a range which is start hcIndex + and - some number.
  const n_colors = startHueChroma.length;
  // The following is just a tricky way to say: for one color, we choose 9; for 2, 4 each; and for 3 or 4, 3 each.
  const n_range = max(3, floor(9/n_colors));
  const offset = (n_colors === 1) ? 4 : n_range;

  // Overlap is complicated. Set up start and end of ranges ahead of filling up the neighbor arrays.
  // Not sure why I can't map the index to a structure.
  // const rangeArray = startIndices.map(
    // start_i => {start: start_i.hcIndex - offset, end: start_i.hcIndex + offset}
    // );
  const rangeArray = [];
  startIndices.forEach((start_i, index) =>
    rangeArray[index] = {start: start_i.hcIndex - offset, end: start_i.hcIndex + offset});
  console.table(rangeArray);
  rangeArray.forEach((range, index) => {
    if (index > 0 && range.start < rangeArray[index-1].end) {
      // Overlap!!! Average the end of previous and start of this, and adjust the ranges that overlap.
      let newStart = round(0.5 * (range.start + rangeArray[index-1].end));
      // Keep the corresponding index in the new range.
      if (newStart > startIndices[index].hcIndex) newStart = startIndices[index].hcIndex;
      range.start = newStart;
      range.end = newStart + 2 * offset;
      rangeArray[index-1].end = newStart - 1;
      // Back up the start of the previous range if we can
      if (index-1 === 0 || rangeArray[index-1].start > rangeArray[index-2].end + 1) {
        let backup = 2 * offset - (rangeArray[index-1].end - rangeArray[index-1].start);
        // Don't back up more than the gap, if there is one.
        if (index-1 > 0) backup = min(backup, rangeArray[index-1].start - rangeArray[index-2].end - 1);
        rangeArray[index-1].start -= backup;
      }
    }
  });

  console.table(rangeArray);
  // Now for each start index, we have a range of neighbors.
  // make a little hueChroma array for each start index, sort by lightness, and choose colors.

  const littleHCArrays = [];
  const n_total_hcs = allHueChromas.length;

  rangeArray.forEach((range, index) => {
    // Collect all candidates for this range and sort by lightness.
    // Remember the array wraps around so start could be negative, end could be >= n.
    const hcRange = [];
    for (let range_i = range.start; range_i <= range.end; range_i++) {
      let ri = range_i;
      if (range_i < 0) ri = range_i + n_total_hcs;
      else if (range_i >= n_total_hcs) ri = range_i - n_total_hcs;
      hcRange.push(allHueChromas[ri]);
    }
    hcRange.sort((a,b) => b.lightness - a.lightness);
    console.table(hcRange);

    const littleHCArray = [];
    // Range might be smaller than the number of colors we wanted.
    const rangeSpan = range.end - range.start;
    const maxIter = min(n_range, rangeSpan);
    for (let hc_i = 0; hc_i < maxIter; hc_i++) {
      let hc_index = round(hc_i * rangeSpan/maxIter);
      console.log(hc_index);
      littleHCArray.push(hcRange[hc_index]);
    }
    // Make sure that the input hueChroma is in the little array.
    const currentHC = allHueChromas[startIndices[index].hcIndex];
    if (littleHCArray.indexOf(currentHC) === -1)
      swapOutNearestHC(currentHC, littleHCArray);
    littleHCArrays.push(littleHCArray);
  });

  // Now that we know which colors are in the final palette, put their ids into the output.
  const newPalette = [];

  startIndices.forEach(startIndex => {
    // Recover the original order
    let littleArray = littleHCArrays[startIndex.siIndex];
    for (let li = 0; li < littleArray.length; li++) {
    // littleArray.foreach(hc => {
      let hc = littleArray[li];
      console.log(hc);
      newPalette.push(hc.colorId);
    };
  });
  return newPalette;
}

// We want to return the original color in the output array.
// TODO: actualyl code this.

function swapOutNearestHC(hueChroma, littleHCArray) {
  let nearestIndex;
  let nearestDistance;
  littleHCArray.forEach((hc, index) => {
    let distance = Math.abs(hueChroma.lightness - hc.lightness);
    if (index === 0 || distance < nearestDistance) {
      nearestIndex = index;
      nearestDistance = distance;
    }
  });

  littleHCArray[nearestIndex] = hueChroma;
}

export default matchPaletteColors;