import { replaceNearestNeighbor } from './color-scheme.js'

function matchPaletteColors(n_each, startHueChroma, hueChromaArray, colors) {

  // First sort hueChromaArray by hue. Add the start ones to the array first.

  const allHueChromas = hueChromaArray.concat(startHueChroma);
  allHueChromas.sort((a,b) => b.hue - a.hue);

  // Find where the start colors are in the hue order.
  // Preserve input order so that output matches it.
  let startInds = [];
  startHueChroma.forEach((hueChroma) =>
    startInds.push(allHueChromas.indexOf(hueChroma)));

  return expandPaletteColors(n_each, startInds, allHueChromas, colors);
}

function expandPaletteColors(n_each, startInds, allHueChromas, colors) {
  // Preserve input order so that output matches it.
  const inputInds = [...startInds];

  // Sort in numerical order to set up non-overlapping ranges.
  startInds.sort((a,b) => a - b);
  // For each starting color, choose a range which is start hcIndex +/- number of output.
  const offset = n_each;

  // Overlap is complicated. Set up start and end of ranges ahead of filling up the neighbor arrays.
  // Not sure why I can't map the index to a structure.
  // const rangeArray = startIndices.map(
    // start_i => {start: start_i - offset, end: start_i + offset}
    // );
  const rangeArray = [];
  startInds.forEach((start_i, index) =>
    rangeArray[index] = {start: start_i - offset, end: start_i + offset});

  rangeArray.forEach((range, index) => {
    if (index > 0 && range.start < rangeArray[index-1].end) {
      // Overlap!!! Average the end of previous and start of this, and adjust the ranges that overlap.
      let newStart = Math.round(0.5 * (range.start + rangeArray[index-1].end));
      // Keep the corresponding index in the new range.
      if (newStart > startInds[index]) newStart = startInds[index];
      range.start = newStart;
      range.end = newStart + 2 * offset;
      rangeArray[index-1].end = newStart - 1;
      // Back up the start of the previous range if we can
      if (index-1 === 0 || rangeArray[index-1].start > rangeArray[index-2].end + 1) {
        let backup = 2 * offset - (rangeArray[index-1].end - rangeArray[index-1].start);
        // Don't back up more than the gap, if there is one.
        if (index-1 > 0) backup = Math.min(backup, rangeArray[index-1].start - rangeArray[index-2].end - 1);
        rangeArray[index-1].start -= backup;
      }
    }
  });

  // Now for each start index, we have a range of neighbors.
  // make a little hueChroma array for each start index, sort by lightness, and choose colors.

  const littleIdArrays = [];
  const n_total_hcs = allHueChromas.length;

  rangeArray.forEach((range, index) => {
    // Collect all candidates for this range and sort by lightness.
    // Remember the array wraps around so start could be negative, or end could be >= n.
    let hcRange = [];
    for (let range_i = range.start; range_i <= range.end; range_i++) {
      let ri = range_i;
      if (range_i < 0) ri = range_i + n_total_hcs;
      else if (range_i >= n_total_hcs) ri = range_i - n_total_hcs;
      hcRange.push(allHueChromas[ri]);
    }
    hcRange.sort((a,b) => b.lightness - a.lightness);

    const littleIdArray = [];
    // Range might be smaller than the number of colors we wanted.
    const rangeSpan = range.end - range.start;
    const maxIter = Math.min(n_each, rangeSpan);
    for (let hc_i = 0; hc_i < maxIter; hc_i++) {
      let hc_index = Math.round(hc_i * rangeSpan/maxIter);
      littleIdArray.push(hcRange[hc_index].colorId);
    }
    littleIdArrays.push(littleIdArray);
    // If start color didn't end up in the little array, replace "nearest" neighbor with it.
    const startColorId = allHueChromas[startInds[index]].colorId;
    if (littleIdArray.indexOf(startColorId) === -1)
      replaceNearestNeighbor(startColorId, littleIdArray, colors);
  });

  // Push the little arrays in the order of input color Ids.

  const newPalette = [];
  inputInds.forEach(input_i => newPalette.push(...littleIdArrays[startInds.indexOf(input_i)]));

  return newPalette;
}

export { matchPaletteColors, expandPaletteColors };