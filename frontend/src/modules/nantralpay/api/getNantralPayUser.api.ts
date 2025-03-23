import axios from 'axios';

import { adaptNantralPayUser } from '../infra/nantralpayUser.adapter';
import { NantralPayUserDTO } from '../infra/nantralpayUser.dto';

export async function getNantralPayUserApi() {
  const { data } = await axios.get<NantralPayUserDTO>('/api/nantralpay/user/');

  return adaptNantralPayUser(data);
}
