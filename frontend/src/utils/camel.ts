import { camelCase, isArray, isObject } from 'lodash-es';

/**
 * Call snakeTocamelCase when an attribute is an object or an array.
 * @param data The data to rename.
 * @param convert The object containing the type into convert and the associate keys. (Only converts to Date and String currently).
 * @param key The name of the attribute.
 */
function renameAttribute<T>(
  data: T | T[],
  convert: Record<keyof T, 'Date' | 'string'>,
  key: string
): void {
  if (isObject(data[key]) || isArray(data[key])) {
    const newConvert = {};
    Object.keys(convert).forEach((convertKey) => {
      if (convertKey.startsWith(`${key}.`)) {
        newConvert[convertKey.slice(key.length + 1)] = convert[convertKey];
      }
    });
    snakeToCamelCase(data[key], newConvert);
  }
}

/**
 * Convert the type of an attribute.
 * @param data The data to convert.
 * @param convert The object containing the type into convert and the associate keys. (Only converts to Date and String currently).
 * @param key The name of the attribute.
 */
function convertType<T>(
  data: T | T[],
  convert: Record<keyof T, 'Date' | 'string'>,
  key: string
): void {
  switch (convert[key]) {
    case 'Date':
      data[key] = new Date(data[key]);
      break;
    case 'string':
      data[key] = String(data[key]);
      break;
    default:
      throw new Error(`Given type ${convert[key]} not implemented`);
  }
}

/**
 * Convert snake_case keys into camelCase keys and convert type of the attributes.
 * @param data The data to convert.
 * @param convert The object containing the type into convert and the associate keys. (Only converts to Date and String currently).
 */
export function snakeToCamelCase<T>(
  data: T | T[],
  convert: Record<keyof T, 'Date' | 'string'>
): void {
  // Convert all elements for array
  if (isArray(data)) {
    data.foreach((val: any) => snakeToCamelCase(val, convert));
  } else {
    // Convert all keys in camelCase format
    Object.keys(data).forEach((key) => {
      if (camelCase(key) !== key) {
        data[camelCase(key)] = data[key];
        delete data[key];
      }
    });
  }

  // Recursive calls and convert data to convert
  Object.keys(data).forEach((key) => {
    renameAttribute(data, convert, key);
    if (key in convert) {
      convertType(data, convert, key);
    }
  });
}
