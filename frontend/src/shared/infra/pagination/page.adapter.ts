import { PageDTO } from './page.dto';
import { Page } from './page.types';

export function adaptPage<DTO, ObjectType>(
  pageDto: PageDTO<DTO>,
  resultsAdapterFunction: (dto: DTO) => ObjectType
): Page<ObjectType> {
  return {
    count: pageDto.count,
    numPages: pageDto.num_pages,
    results: pageDto.results.map(resultsAdapterFunction),
    next: pageDto.next,
    previous: pageDto.previous,
  };
}
