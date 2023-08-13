/**
 * A function to get the positive modulo of a number.
 * @param a The number on which to apply the operation.
 * @param b The modulo.
 * @returns The positive modulo of a by b.
 */
export function modulo(a: number, b: number) {
  return ((a % b) + b) % b;
}
