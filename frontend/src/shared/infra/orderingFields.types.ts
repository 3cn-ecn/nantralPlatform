type SortField<T> =
  | Extract<keyof T, string>
  | `-${Extract<keyof T, string>}`
  | `${Extract<keyof T, string>}__${string}`
  | `-${Extract<keyof T, string>}__${string}`;

export type OrderingField<T> =
  | SortField<T>
  | `${SortField<T>}, ${SortField<T>}`
  | `${SortField<T>}, ${SortField<T>}, ${string}`;
