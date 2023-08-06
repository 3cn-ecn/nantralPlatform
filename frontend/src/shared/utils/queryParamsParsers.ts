import { isValid } from 'date-fns';
import { isArray, isDate, snakeCase } from 'lodash';

export const parseNullBool = (value: string | null): boolean | null => {
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  return null;
};

export const parseDate = (value: string | null): Date | null => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return null;
  }
  return date;
};

export const parseNumber = (value: string | null): number | null => {
  if (value === null) {
    return null;
  }
  const number = Number(value);
  if (isNaN(number)) {
    return null;
  }
  return number;
};

export const parseString = (value: string | null): string | null => {
  if (!value) {
    return null;
  }
  return value;
};

export const convertCamelToSnakeCase = (input: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(input).map(([key, value]) => [snakeCase(key), value])
  );

export const convertToURLSearchParams = (
  params: Record<string, unknown>
): URLSearchParams => {
  // Crée une nouvelle instance de URLSearchParams
  const searchParams = new URLSearchParams();

  // Parcours chaque clé-valeur de l'objet et les ajoute à l'instance de URLSearchParams
  for (const key in params) {
    const value = params[key];
    if (value === undefined || value === null || value === '') {
      continue;
    } else if (isArray(value)) {
      value.forEach((item) => searchParams.append(key, item.toString()));
    } else if (isDate(value)) {
      if (!isValid(value)) continue;
      searchParams.append(key, value.toISOString());
    } else {
      searchParams.append(key, value.toString());
    }
  }

  return searchParams;
};
