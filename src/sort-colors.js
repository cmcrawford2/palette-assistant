// Here are all the functions to sort the color chips.

/*function compareLightness (color1, color2) {
    // From wikipedia - doesn't really do it for me.
    var XMax1 = Math.max(color1.color[1], color1.color[2], color1.color[3]);
    var XMin1 = Math.min(color1.color[1], color1.color[2], color1.color[3]);
    var XMax2 = Math.max(color2.color[1], color2.color[2], color2.color[3]);
    var XMin2 = Math.min(color2.color[1], color2.color[2], color2.color[3]);
    return (XMax2 + XMin2) - (XMax1 + XMin1);
  }*/

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

  export {sortRGB, sortCMYK, sort6};