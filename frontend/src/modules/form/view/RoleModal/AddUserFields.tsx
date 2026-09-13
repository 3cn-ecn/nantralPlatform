import { useMemo, useState } from 'react';

import {
  FormControl,
  FormHelperText,
  ListItemText,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getUserListApi } from '#modules/account/api/getUserList.api';
import { addRolesApi } from '#modules/form/api/addRoles.api';
import { JsonFormPreview, UserRole } from '#modules/form/types/jsonForm.type';
import { AutocompleteSearchField } from '#shared/components/FormFields';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

export function AddUserFields({ jsonForm }: { jsonForm: JsonFormPreview }) {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const { t } = useTranslation();

  const items = useMemo(
    () => ({
      editor: {
        label: t('jsonForm.roles.editor'),
        helperText: t('jsonForm.roles.editorHelp'),
      },
      answer_viewer: {
        label: t('jsonForm.roles.answerViewer'),
        helperText: t('jsonForm.roles.answerViewerHelp'),
      },
      form_viewer: {
        label: t('jsonForm.roles.formViewer'),
        helperText: t('jsonForm.roles.formViewerHelp'),
      },
    }),
    [t],
  );

  const [userRoles, setUserRoles] = useState<{
    users: number[];
    role: Exclude<UserRole['role'], 'owner'>;
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
    <Stack direction={{ md: 'row' }} gap={1}>
      <AutocompleteSearchField
        multiple
        name="user"
        label={t('jsonForm.roles.addUsers')}
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
          aria-label={t('jsonForm.roles.roleChoice')}
          value={userRoles.role}
          size="small"
          margin={'none'}
          onChange={(e) =>
            setUserRoles({
              ...userRoles,
              role: e.target.value as Exclude<UserRole['role'], 'owner'>,
            })
          }
          renderValue={(val) => items[val].label}
        >
          {Object.entries(items).map(([id, item]) => (
            <MenuItem key={id} value={id}>
              <ListItemText
                sx={{ textWrap: 'wrap', maxWidth: 400 }}
                primary={item.label}
                secondary={item.helperText}
              />
            </MenuItem>
          ))}
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
        {t('button.add')}
      </LoadingButton>
    </Stack>
  );
}
