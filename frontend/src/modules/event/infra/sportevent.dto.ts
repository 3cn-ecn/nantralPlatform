import { GroupPreviewDTO } from '#modules/group/infra/group.dto';
import { TranslatedFieldsDTO } from '#shared/infra/translatedFields/translatedField.dto';

export type SportEventDTO = {
  id: number;
  description: string;
  date: string;
  is_participating: boolean | null;
  participants: number;
  non_participants: number;
  location: string;
  owner: GroupPreviewDTO;
  type: number;
} & TranslatedFieldsDTO<'description'>;

export type SportEventFormDTO = Pick<
  SportEventDTO,
  'location' | 'date' | 'type'
> & {
  // keep unused fields for typing errors
  description: undefined;
  group: number; // id of group
} & TranslatedFieldsDTO<'description'>;
