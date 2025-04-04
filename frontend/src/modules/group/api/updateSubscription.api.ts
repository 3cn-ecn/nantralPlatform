import axios from 'axios';

import { adaptApiFormErrors, ApiFormError } from '#shared/infra/errors';

export async function updateSubscriptionApi(slug: string, subscribe: boolean) {
  axios
    .post(`/api/group/group/${slug}/update_subscription/`, { subscribe })
    .catch((err: ApiFormError<{ subscribe: boolean }>) => {
      console.log(err);
      throw adaptApiFormErrors(err);
    });
}
