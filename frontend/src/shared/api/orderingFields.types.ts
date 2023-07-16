export type OrderingFields<T> = Array<
  | Extract<keyof T, string>
  | `-${Extract<keyof T, string>}`
  | `${Extract<keyof T, string>}__${string}`
  | `-${Extract<keyof T, string>}__${string}`
>;
