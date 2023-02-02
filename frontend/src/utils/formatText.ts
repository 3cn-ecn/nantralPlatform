/**
 * Capitalize the first letter of a word
 * @param str the word you want to capitalize
 * @returns the word with the first letter capitalized
 */
export function CapitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
