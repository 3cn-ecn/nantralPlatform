import { NantralPayEventDTO } from '#modules/nantralpay/infra/nantralpayEvent.dto';
import { NantralPayEvent } from '#modules/nantralpay/types/nantralpayEvent.type';

export function adaptNantralPayEvent(
  nantralPayEventDto: NantralPayEventDTO,
): NantralPayEvent {
  return {
    id: nantralPayEventDto.id || 0,
    balance: nantralPayEventDto.nantralpay_balance || 0,
    title: nantralPayEventDto.title,
    hasBeenOpened: nantralPayEventDto.nantralpay_has_been_opened || false,
    isOpen: nantralPayEventDto.nantralpay_is_open || false,
  };
}
