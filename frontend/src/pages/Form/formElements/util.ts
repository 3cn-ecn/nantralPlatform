import { clone, get, set } from 'lodash';

export function deepSet(object: any, path: string | string[], value: any) {
  if (typeof path === 'string') {
    path = path.split('.');
  }
  return set(
    clone(object),
    path.filter((v) => v !== ''),
    value,
  );
}

export function deepGet(
  object: any,
  path: string | string[],
  defaultValue?: any,
) {
  if (typeof path === 'string') {
    path = path.split('.');
  }
  return get(
    object,
    path.filter((v) => v !== ''),
    defaultValue,
  );
}
