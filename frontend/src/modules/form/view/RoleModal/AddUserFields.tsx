import { useState } from 'react';

import { FormControl, FormHelperText, MenuItem, Select } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getUserListApi } from '#modules/account/api/getUserList.api';
import { addRolesApi } from '#modules/form/api/addRoles.api';
import { JsonFormPreview, UserRole } from '#modules/form/types/jsonForm.type';
import { FlexAuto } from '#shared/components/FlexBox/FlexBox';
import { AutocompleteSearchField } from '#shared/components/FormFields';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { useToast } from '#shared/context/Toast.context';
import { ApiFormError } from '#shared/infra/errors';

export function AddUserFields({ jsonForm }: { jsonForm: JsonFormPreview }) {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const [userRoles, setUserRoles] = useState<{
    users: number[];
    role: UserRole['role'];
  }>({ users: [], role: 'editor' });
  const [errors, setErrors] = useState<
    ApiFormError<{ users: number; role: string }> | undefined
  >(undefined);

  async function fetchOptions(search: string) {
    const data = await getUserListApi({ search: search });
    return data.results;
  }

  const { mutate: addUsers, isPending: addLoading } = useMutation({
    mutationFn: ({
      users,
      role,
    }: {
      users: number[];
      role: UserRole['role'];
    }) => addRolesApi(users, role, jsonForm.uuid),
    onError: (error: ApiFormError<{ users: number; role: string }>) => {
      showToast({
        message:
          error.globalErrors.length > 0
            ? error.globalErrors.join(', ')
            : error.message,
        variant: 'error',
      });
      setErrors(error);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['formRoles', jsonForm.uuid],
      });
      setUserRoles({ users: [], role: 'editor' });
      setErrors(undefined);
    },
  });

  return (
    <FlexAuto gap={1}>
      <AutocompleteSearchField
        multiple
        name="user"
        label={'Ajoutez des utilisateurs'}
        value={userRoles.users}
        handleChange={(val) => setUserRoles({ ...userRoles, users: val })}
        defaultObjectValue={[]}
        required
        fetchOptions={fetchOptions}
        labelPropName="name"
        imagePropName="picture"
        errors={errors?.fields?.users}
      />
      <FormControl
        error={Boolean(errors?.fields.role?.length)}
        sx={{ flexShrink: 0, my: 'auto' }}
      >
        <Select
          aria-label={'Choose role'}
          value={userRoles.role}
          size="small"
          margin={'none'}
          onChange={(e) =>
            setUserRoles({
              ...userRoles,
              role: e.target.value as UserRole['role'],
            })
          }
        >
          <MenuItem value={'editor'}>Editor</MenuItem>
          <MenuItem value={'answer_viewer'}>Result Viewer</MenuItem>
          <MenuItem value={'form_viewer'}>Form Viewer</MenuItem>
        </Select>
        {errors?.fields.role?.length && (
          <FormHelperText>{errors.fields.role.join(', ')}</FormHelperText>
        )}
      </FormControl>
      <LoadingButton
        variant="contained"
        onClick={() => addUsers(userRoles)}
        loading={addLoading}
        sx={{ my: 'auto', flexShrink: 0 }}
      >
        Add Users
      </LoadingButton>
    </FlexAuto>
  );
}
