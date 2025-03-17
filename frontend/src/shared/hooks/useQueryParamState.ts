import { useSearchParams } from 'react-router-dom';

export function useQueryParamState<
  T extends { toString(): string } | null = string,
>(
  key: string,
  defaultValue: T,
  parseValue: (value: string) => T = (value) => value as unknown as T,
): [T, (newValue: T | null) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get the query param value or fallback to the default value
  const stringValue = searchParams.get(key);
  const value = stringValue ? parseValue(stringValue) : defaultValue;

  // Function to update the state and query params
  const setValue = (newValue: T) => {
    if (newValue && newValue !== defaultValue) {
      searchParams.set(key, newValue.toString());
    } else {
      searchParams.delete(key);
    }

    setSearchParams(searchParams, { preventScrollReset: true });
  };

  return [value, setValue];
}
