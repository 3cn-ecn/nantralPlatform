import axios from 'axios';

import { adaptApiErrors } from '#shared/infra/errors';

export default async function changeUsernameApi({
  username,
}: {
  username: string;
}) {
  try {
    const res = await axios.put('/api/account/edit_username/', { username });
    return res.data as { username: string };
  } catch (err) {
    throw adaptApiErrors(err);
  }
}
