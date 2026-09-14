import { useParams } from 'react-router';

import { Container, Stack, Typography } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';

import { getJsonSchemaApi } from '#modules/form/api/getJsonSchema.api';
import { getDefaultForm } from '#modules/form/constants';
import { FormProvider } from '#modules/form/state/form.context';
import { jsonFormToNode } from '#modules/form/state/utils';
import { FormItemActions } from '#modules/form/view/shared/FormItemActions';
import { SaveForm } from '#modules/form/view/shared/SaveForm';
import { FormEditRoot } from '#pages/Form/components/Edit/FormEditRoot';
import { FormHeaderFields } from '#pages/Form/components/Edit/FormHeaderFields';
import { SelectBaseComponent } from '#pages/Form/components/Edit/SelectBaseComponent';
import { FlexCol } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

export default function EditFormPage() {
  const { uuid } = useParams();
  const { data: formSchema } = useSuspenseQuery({
    queryKey: ['form', uuid],
    queryFn: () =>
      !uuid || uuid === 'new' ? getDefaultForm() : getJsonSchemaApi(uuid),
  });

  const { t } = useTranslation();

  return (
    <Container sx={{ py: 4 }}>
      <FormProvider initialForm={jsonFormToNode(formSchema)}>
        <FlexCol gap={3}>
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            gap={2}
          >
            <Typography variant={'h1'}>{t('jsonForm.edit.title')}</Typography>
            <FormItemActions formPreview={formSchema} />
          </Stack>
          <FormHeaderFields />
          <SelectBaseComponent />
          <FormEditRoot />
          <SaveForm />
        </FlexCol>
      </FormProvider>
    </Container>
  );
}
