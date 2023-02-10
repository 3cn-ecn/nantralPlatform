/**
 * A function that returns the pgcd between 2 numbers.
 * @param a The first number.
 * @param b The second number.
 * @returns The pgcd of the 2 numbers.
 */
export function pgcd(a: number, b: number) {
  let dividende = a;
  let reste = b;
  let temp;
  const maxIter = 1000;
  let iter = 0;
  while (reste !== 0 && iter < maxIter) {
    temp = dividende % reste;
    dividende = reste;
    reste = temp;
    iter += 1;
  }
  if (reste !== 0) {
    console.warn('Un pgcd a échoué');
  }
  return dividende;
}

/**
 * A function that returns the ppcm between 2 numbers.
 * @param a The first number.
 * @param b The second number.
 * @returns The ppcm of the 2 numbers.
 */
export function ppcm(a: number, b: number) {
  return (a * b) / pgcd(a, b);
}
