import { GroupThematic } from '../types/groupThematic.types';
import { GroupThematicDTO } from './groupThematic.dto';

export function adaptGroupThematic(
  groupThematic: GroupThematicDTO,
): GroupThematic {
  return {
    id: groupThematic.identifier,
    name: groupThematic.name,
    priority: groupThematic.priority,
  };
}

export function adaptGroupThematicDTO(
  groupThematic: GroupThematic,
): GroupThematicDTO {
  return {
    identifier: groupThematic.id,
    name: groupThematic.name,
    priority: groupThematic.priority,
  };
}
