import LinkIcon from '@mui/icons-material/Link';
import { IconButton, Stack, Tooltip } from '@mui/material';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { setFormPrivateApi } from '#modules/form/api/setFormPrivate.api';
import { setFormPublicApi } from '#modules/form/api/setFormPublic.api';
import {
  JsonFormPreview,
  JsonFormSchema,
} from '#modules/form/types/jsonForm.type';
import { SwitchField } from '#shared/components/FormFields';
import { useTranslation } from '#shared/i18n/useTranslation';
import { Page } from '#shared/infra/pagination';
import { buildAbsoluteUrl } from '#shared/utils/urls';

export function PublicControl({
  formPreview,
}: {
  formPreview: JsonFormPreview;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (val: boolean) =>
      val
        ? setFormPublicApi(formPreview.uuid)
        : setFormPrivateApi(formPreview.uuid),
    onSuccess() {
      queryClient.setQueryData(
        ['forms'],
        (data: InfiniteData<Page<JsonFormPreview>>) => ({
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            results: page.results.map((form) =>
              form.uuid === formPreview.uuid
                ? { ...form, public: !form.public }
                : form,
            ),
          })),
        }),
      );
      queryClient.setQueryData(
        ['form', formPreview.uuid],
        (form: JsonFormSchema) => ({ ...form, public: !form.public }),
      );
    },
  });

  return (
    <Stack direction={'row'}>
      <SwitchField
        label={t('jsonForm.roles.public')}
        helperText={t('jsonForm.roles.publicHelp')}
        handleChange={mutate}
        value={formPreview.public}
      />
      <Tooltip title={t('jsonForm.details.link')}>
        <IconButton
          onClick={() =>
            navigator.clipboard.writeText(
              buildAbsoluteUrl(`/form/${formPreview.uuid}/`),
            )
          }
        >
          <LinkIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
