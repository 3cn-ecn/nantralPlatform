import { PartialGroup } from '../group.type';
import { PartialGroupDTO } from './group.dto';

export function adaptPartialGroup(groupDTO: PartialGroupDTO): PartialGroup {
  return {
    id: groupDTO.id,
    name: groupDTO.name,
    shortName: groupDTO.short_name,
    slug: groupDTO.slug,
    url: groupDTO.url,
  };
}
