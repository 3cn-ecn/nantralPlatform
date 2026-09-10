import { useLoaderData } from 'react-router';

import { Container, Stack, Typography } from '@mui/material';

import { FormProvider } from '#modules/form/state/form.context';
import { jsonFormToNode } from '#modules/form/state/utils';
import { FormEditRoot } from '#modules/form/view/shared/FormEditRoot';
import { FormHeaderFields } from '#modules/form/view/shared/FormHeaderFields';
import { FormItemActions } from '#modules/form/view/shared/FormItemActions';
import { SaveForm } from '#modules/form/view/shared/SaveForm';
import { SelectBaseComponent } from '#modules/form/view/shared/SelectBaseComponent';
import { FlexCol } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

export default function EditFormPage() {
  const { formSchema } = useLoaderData();
  const { t } = useTranslation();

  return (
    <Container sx={{ my: 2 }}>
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
