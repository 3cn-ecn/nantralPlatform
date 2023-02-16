import lodash from 'lodash';

/**
 * Convert snake_case keys into camelCase keys and convert type of the attributes.
 * @param data The data to convert.
 * @param toConvert The object containing the type into convert and the associate keys. (Only converts to Date currently)
 */
export function snakeIntoCamel(
  data: any,
  toConvert: {
    type2Convert: string;
    keys: Array<string>;
  }[]
): any {
  const convertData = {};
  toConvert.forEach((item) => {
    // Add type2Convert here
    if (item.type2Convert === 'Date') {
      item.keys.forEach((key) => {
        convertData[lodash.camelCase(key)] = new Date(data[key]);
      });
    }
  });
  Object.keys(data).forEach((key) => {
    if (!Object.keys(convertData).includes(lodash.camelCase(key))) {
      convertData[lodash.camelCase(key)] = data[key];
    }
  });
  return convertData;
}
