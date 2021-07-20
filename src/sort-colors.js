// Functions to sort the color chips.

function RGBtoHex (r, g, b) {
  var HexColor = "#";
  if (r < 16) HexColor += "0";
  HexColor += r.toString(16);
  if (g < 16) HexColor += "0";
  HexColor += g.toString(16);
  if (b < 16) HexColor += "0";
  HexColor += b.toString(16);
  return HexColor;
}

function getWeights() {
  // r g b
  return [0.299, 0.587, 0.114];
}

function getLightness(colorRGB) {
    const [rWeight, gWeight, bWeight] = getWeights();
    const red = colorRGB.color[1]/255;
    const green = colorRGB.color[2]/255;
    const blue = colorRGB.color[3]/255;
  
    return rWeight * red + gWeight * green + bWeight * blue;
}

function RGBtoHueChroma (colorRGB) {
  const [rWeight, gWeight, bWeight] = getWeights();

  const red = colorRGB.color[1]/255;
  const green = colorRGB.color[2]/255;
  const blue = colorRGB.color[3]/255;

  if (red === green && red === blue) return [];
  
  const alpha = 0.5 * (2 * red - green - blue);
  const beta = Math.sqrt(3) * 0.5 * (green - blue);
  
  const hueChroma = {
    colorId: colorRGB.id,
    hue: Math.atan2(alpha, beta),
    chroma: Math.sqrt(alpha * alpha + beta * beta),
    // lightness: red+green+blue,
    // lightness: Math.min(colorRGB.color[1], colorRGB.color[2], colorRGB.color[3]),
    lightness: rWeight * red + gWeight * green + bWeight * blue,
  };

  // TODO: Understand why I have to return an array.
  return hueChroma;
}

function isGray (color) {
  // RGB values are in color[1:3]
  return ((color.color[1] === color.color[2]) && (color.color[1] === color.color[3]));
}

function sortRGB (colors, colorIds, compareFunction) {
    var grays = [];
    var reds = [];
    var greens = [];
    var blues = [];

    for (var i = 0; i < colorIds.length; i++) {
      var colorId = colorIds[i];
      var colorChip = colors[colorId];
      var r = colorChip.color[1];
      var g = colorChip.color[2];
      var b = colorChip.color[3];
      if (r === g && r === b) {
        grays.push(colorId);
      }
      else if (r >= g && r > b) {
        reds.push(colorId);
      }
      else if (g >= b && g > r) {
        greens.push(colorId);
      }
      else { // b >= r && b > g
        blues.push(colorId);
      }
    }
    grays.sort(compareFunction);
    reds.sort(compareFunction);
    greens.sort(compareFunction);
    blues.sort(compareFunction);

    return reds.concat(greens, blues, grays);
  }

  function sortCMYK (colors, colorIds, compareFunction) {
    var cyans = [];
    var magentas = [];
    var yellows = [];
    var grays = [];

    for (var i = 0; i < colorIds.length; i++) {
      var colorId = colorIds[i];
      var colorChip = colors[colorId];
      var r = colorChip.color[1];
      var g = colorChip.color[2];
      var b = colorChip.color[3];
      if (r === g && r === b) {
        grays.push(colorId);
      }
      else if (r < g && r <= b) {
        cyans.push(colorId);
      }
      else if (g <= b && g <= r) {
        magentas.push(colorId);
      }
      else { // b < r && b < g
        yellows.push(colorId);
      }
    }
    grays.sort(compareFunction);
    cyans.sort(compareFunction);
    magentas.sort(compareFunction);
    yellows.sort(compareFunction);
    
    return cyans.concat(magentas, yellows, grays);
  }

  function sort6 (colors, colorIds, compareFunction) {
    var reds = [];
    var greens = [];
    var blues = [];
    var cyans = [];
    var magentas = [];
    var yellows = [];
    var grays = [];

    for (var i = 0; i < colorIds.length; i++) {
      var colorId = colorIds[i];
      var colorChip = colors[colorId];
      // Take out the darkest value to sort into buckets.
      var darkest = Math.min(colorChip.color[1], colorChip.color[2], colorChip.color[3]);
      var r = colorChip.color[1] - darkest;
      var g = colorChip.color[2] - darkest;
      var b = colorChip.color[3] - darkest;
      if (r === g && r === b) {
        grays.push(colorId);
      }
      else if (r >= 2*b && r >= 2*g) {
        reds.push(colorId);
      }
      else if (b >= 2*g && b >= 2*r) {
        blues.push(colorId);
      }
      else if (g >= 2*r && g >= 2*b) {
        greens.push(colorId);
      }
      else if (r > b && g > b && r < 2*g && g < 2*r) {
        yellows.push(colorId);
      }
      else if (b > g && r > g && b < 2*r && r < 2*b) {
        magentas.push(colorId);
      }
      else if (g > r && b > r && g < 2*b && b < 2*g) {
        cyans.push(colorId);
      }
    }
    reds.sort(compareFunction);
    greens.sort(compareFunction);
    blues.sort(compareFunction);
    cyans.sort(compareFunction);
    magentas.sort(compareFunction);
    yellows.sort(compareFunction);
    grays.sort(compareFunction);

    return reds.concat(yellows, greens, cyans, blues, magentas, grays);
  }

  export {getWeights, getLightness, sortRGB, sortCMYK, sort6, RGBtoHex, RGBtoHueChroma, isGray};