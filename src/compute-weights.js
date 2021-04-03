import { transpose } from 'mathjs'
import { multiply } from 'mathjs'
import { inv } from 'mathjs'

export default function computeNewWeights (colorArray) {

  // Set up labels as evenly distributed values between start and end.
  // Compute start and end using parameters   gWeight = 0.587, rWeight = 0.299, and bWeight = 0.114.
  var startY = 0.587 * colorArray[0][0] + 0.299 * colorArray[0][1] + 0.114 * colorArray[0][2];
  var n_col = colorArray.length;
  var endY = 0.587 * colorArray[n_col - 1][0] + 0.299 * colorArray[n_col - 1][1] + 0.114 * colorArray[n_col - 1][2];
  var coeff = (endY - startY) / (n_col - 1);
  var labels = [];

  for (var i = 0; i < n_col; i++) {
    labels[i] = startY + i * coeff;
  }

  // Use matrix operations on arrays.
  // We are using the direct "normal equation" to get new coefficients.

  var AT = transpose(colorArray);
  var AAT = multiply(AT, colorArray);
  var AAT_Inv = inv(AAT);
  var AAT_InvAT = multiply(AAT_Inv, AT);
  var solution = multiply(AAT_InvAT, labels);

  return solution;
}