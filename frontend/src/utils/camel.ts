import { camelCase, isArray, isObject } from 'lodash';

/**
 * Convert snake_case keys into camelCase keys and convert type of the attributes.
 * @param data The data to convert.
 * @param convert The object containing the type into convert and the associate keys. (Only converts to Date and String currently)
 */
export function snakeToCamelCase<T>(
  data: T | T[],
  convert: Record<keyof T, 'Date' | 'string'>
): void {
  // Convert all elements for array
  if (isArray(data)) {
    data.map((val: any) => snakeToCamelCase(val, convert));
  } else {
    // Convert all keys in camelCase format
    Object.keys(data).forEach((key) => {
      if (camelCase(key) !== key) {
        data[camelCase(key)] = data[key];
        delete data[key];
      }
    });

    // recursive calls
    Object.keys(data).forEach((key) => {
      if (isObject(data[key]) || isArray(data[key])) {
        const newConvert = {};
        Object.keys(convert).forEach((convertKey) => {
          if (convertKey.startsWith(`${key}.`)) {
            newConvert[convertKey.slice(key.length + 1)] = convert[convertKey];
          }
        });
        snakeToCamelCase(data[key], newConvert);
      }
    });

    // Convert types
    Object.keys(data).forEach((key) => {
      if (key in convert) {
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
    });
  }
}
