/**
 * Function that returns if all the value of an array are in another one.
 * @param ar1 The array to check if the values are in the other.
 * @param ar2 The array to check if it contains the values.
 * @returns If the values of the first array are in the second.
 */
export function isInArray(ar1: Array<number>, ar2: Array<number>) {
  let same = true;
  let iterator = 0;
  while (same && iterator < ar1.length) {
    same = ar2.includes(ar1[iterator]);
    iterator += 1;
  }
  return same;
}
