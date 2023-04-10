import { camelCase, isArray, isObject, snakeCase } from 'lodash-es';

/** Define the type of the convert argument for the convertKeys fonctions */
export type ConvertObject<T> = T extends Array<infer S>
  ? ConvertObject<S>
  : {
      [K in keyof T]?: T[K] extends object ? ConvertObject<T[K]> : 'Date';
    };

/**
 * Convert the data coming from Python through the API to data formatted for
 * Javascript. In particular, it renames keys to camelCase, and convert data to
 * specific types not supported by the JSON format.
 * Types currently supported: Date.
 * Modify the object in place, and returns it.
 *
 * Example of usage :
 * > teachers = [{
 * >   first_name: 'Jean-Yves',
 * >   last_name: 'Martin',
 * >   lessons: [
 * >     { name: 'BDONN', start_hour: '2023-01-02T08:00:00Z' },
 * >     { name: 'SECUR', start_hour: '2023-01-02T13:45:00Z' }
 * >   ]
 * > }
 * > convertDates = { lessons: { startHour: 'Date' }}
 * > convertFromPythonData(teachers, convertDates)
 * [{
 *   firstName: 'Jean-Yves',
 *   lastName: 'Martin',
 *   lessons: [
 *     { name: 'BDONN', startHour: Date(2023-01-02T08:00:00Z) },
 *     { name: 'SECUR', startHour: Date(2023-01-02T13:45:00Z) }
 *   ]
 * }
 *
 * @param data - The data object to convert (can be a list of objects)
 * @param convert - An object indicating the type conversions to apply on data
 */
export function convertFromPythonData<T>(
  data: T,
  convert?: ConvertObject<T>
): T {
  // Recursive call for array
  if (isArray(data)) {
    return data.map((val) => convertFromPythonData(val, convert)) as T;
  }

  Object.keys(data).forEach((oldKey) => {
    // rename key to camelCase
    const key = camelCase(oldKey);
    if (key !== oldKey) {
      data[key] = data[oldKey];
      delete data[oldKey];
    }
    // convert types recursively
    if (isArray(data[key])) {
      data[key] = convertFromPythonData(data[key], convert);
    } else if (isObject(data[key])) {
      data[key] = convertFromPythonData(data[key], convert?.[key]);
    } else {
      switch (convert?.[key]) {
        case 'Date':
          data[key] = data[key] ? new Date(data[key]) : data[key];
          break;
        default:
          break;
      }
    }
  });

  return data;
}

/**
 * Convert the data coming from JavaScript to data formatted for the Python API.
 * In particular, it renames keys to snake_case.
 * Modify the object in place, and returns it.
 *
 * Example of usage :
 * > teachers = [{
 * >   firstName: 'Jean-Yves',
 * >   lastName: 'Martin',
 * >   lessons: [
 * >     { name: 'BDONN', startHour: Date(2023-01-02T08:00:00Z) },
 * >     { name: 'SECUR', startHour: Date(2023-01-02T13:45:00Z) }
 * >   ]
 * > }
 * > convertToPythonData(teachers)
 * [{
 *   first_name: 'Jean-Yves',
 *   last_name: 'Martin',
 *   lessons: [
 *     { name: 'BDONN', start_hour: '2023-01-02T08:00:00Z' },
 *     { name: 'SECUR', start_hour: '2023-01-02T13:45:00Z' }
 *   ]
 * }
 *
 * @param data - The data object to convert (can be a list of objects)
 */
export function convertToPythonData<T>(data: T): T {
  // Recursive call for array
  if (isArray(data)) {
    return data.map((val) => convertToPythonData(val)) as T;
  }

  Object.keys(data).forEach((oldKey) => {
    // rename key to camelCase
    const key = snakeCase(oldKey);
    if (key !== oldKey) {
      data[key] = data[oldKey];
      delete data[oldKey];
    }
    // convert recursively
    if (isArray(data[key]) || isObject(data[key])) {
      data[key] = convertToPythonData(data[key]);
    }
  });

  return data;
}
