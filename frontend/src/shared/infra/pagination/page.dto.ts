export type PageDTO<DTO> = {
  count: number;
  num_pages: number;
  next: string | null;
  previous: string | null;
  results: Array<DTO>;
};
