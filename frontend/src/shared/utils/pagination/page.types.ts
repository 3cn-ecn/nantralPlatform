export type Page<ObjectType> = {
  count: number;
  numPages: number;
  results: Array<ObjectType>;
};
