export interface Page<ObjectType> {
  count: number;
  numPages: number;
  results: ObjectType[];
  next: string | null;
  previous: string | null;
}
