export type Page<ObjectType> = {
  count: number;
  numPages: number;
  results: Array<ObjectType>;
  next: string | null;
  previous: string | null;
};
