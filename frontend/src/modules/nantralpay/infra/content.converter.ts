import { ContentForm } from '../types/content.type';
import { ContentFormDTO } from './content.dto';

export function convertContentForm(contentForm: ContentForm): ContentFormDTO {
  return {
    item: contentForm.item,
    quantity: contentForm.quantity,
  };
}
