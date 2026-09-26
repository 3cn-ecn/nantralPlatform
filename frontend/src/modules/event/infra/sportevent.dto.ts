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
  parent: number | null;
  child: number | null;
  // only in details
  repeat_until?: string | null;
} & TranslatedFieldsDTO<'description'>;

export type SportEventFormDTO = Pick<
  SportEventDTO,
  'location' | 'date' | 'type'
> & {
  // keep unused fields for typing errors
  description: undefined;
  owner: number | null; // id of group
  // absent: do not change the repetition, null: no repetition
  repeat_until?: string | null;
} & TranslatedFieldsDTO<'description'>;
