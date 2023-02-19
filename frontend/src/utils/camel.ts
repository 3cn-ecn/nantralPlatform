import { camelCase, isArray, isObject } from 'lodash';

/**
 * Convert snake_case keys into camelCase keys and convert type of the attributes.
 * @param data The data to convert.
 * @param convert The object containing the type into convert and the associate keys. (Only converts to Date and String currently)
 */
export function snakeToCamelCase<T>(
  data: T,
  convert: Record<keyof T, 'Date' | 'string'>
): void {
  // Convert all keys in camelCase format
  Object.keys(data).forEach((key) => {
    if (camelCase(key) !== key) {
      data[camelCase(key)] = data[key];
      delete data[key];
    }
  });

  // recursive calls
  Object.keys(data).forEach((key) => {
    if (isArray(data[key])) {
      data[key].map((val: any) => snakeToCamelCase(val, convert));
    }
    if (isObject(data[key])) {
      Object.keys(data[key]).forEach((dataKey: string) => {
        snakeToCamelCase(data[key][dataKey], convert);
      });
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
          console.warn('given type not implemented');
          break;
      }
    }
  });
}
