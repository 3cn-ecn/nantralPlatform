/**
 * Capitalize the first letter of a word
 * @param str the word you want to capitalize
 * @returns the word with the first letter capitalized
 */
export function CapitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Create a color from a string.
 *
 * @param string The string to create the color from
 * @returns A color as a hexadecimal string
 */
export function stringToColor(string: string): string {
  let hash = 0;
  /* eslint-disable no-bitwise */
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */
  return color;
}
