import { Content } from '../types/content.type';
import { ContentDto } from './content.dto';

export function adaptContent(contentDto: ContentDto): Content {
  return {
    id: contentDto.id,
    quantity: contentDto.quantity,
    item: contentDto.item,
  };
}
