import { adaptGroupPreview } from '#modules/group/infra/group.adapter';
import { adaptTranslatedField } from '#shared/infra/translatedFields/translatedField.adapter';

import { SportEvent } from '../sportevent.type';
import { SportEventDTO } from './sportevent.dto';

export function adaptSportEventDTO(dto: SportEventDTO): SportEvent {
  return {
    id: dto.id,
    description: dto.description,
    descriptionTranslated: adaptTranslatedField(dto, 'description'),
    date: new Date(dto.date),
    isParticipating: dto.is_participating,
    participantsCount: dto.participants,
    nonParticipantsCount: dto.non_participants,
    location: dto.location,
    group: adaptGroupPreview(dto.owner),
    type: dto.type,
  };
}
