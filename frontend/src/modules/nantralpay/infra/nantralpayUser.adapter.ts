import { NantralPayUserDTO } from '#modules/nantralpay/infra/nantralpayUser.dto';

import { NantralPayUser } from '../types/nantralpayUser.type';

export function adaptNantralPayUser(
  nantralPayUserDto: NantralPayUserDTO,
): NantralPayUser {
  return {
    id: nantralPayUserDto.id,
    balance: nantralPayUserDto.nantralpay_balance,
  };
}
