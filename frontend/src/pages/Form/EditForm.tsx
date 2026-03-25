import { useState } from 'react';

import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { Box } from '@mui/material';
import { clone, set } from 'lodash';

import { JsonFormSchema } from '#modules/form/jsonForm.type';
import { BaseLayout } from '#pages/Form/formElements/BaseLayout';
import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';

export default function EditForm() {
  const [data, setData] = useState({});

  const [jsonForm, setJsonForm] = useState<JsonFormSchema>({
    uuid: 'none',
    name: 'none',
    description: 'none',
    i18nKeys_en: {},
    i18nKeys_fr: {},
    schema: { type: 'object', properties: {} },
    uiSchema: {},
  });

  return (
    <>
      <FlexRow my={2} gap={2} mx={5}>
        <Box width={'50%'}>
          <BaseLayout
            path={''}
            jsonForm={jsonForm}
            setJsonForm={(path, val) => {
              setJsonForm(set(clone(jsonForm), path, val));
              setData({});
            }}
            allowedLayoutTypes={[
              'Categorization',
              'Group',
              'HorizontalLayout',
              'VerticalLayout',
            ]}
          />
        </Box>
        <FlexCol gap={2} width={'50%'}>
          {jsonForm && (
            <JsonForms
              schema={clone(jsonForm.schema)}
              uischema={clone(jsonForm.uiSchema)}
              data={data}
              renderers={materialRenderers}
              cells={materialCells}
              onChange={({ data }) => setData(data)}
            />
          )}
          {JSON.stringify(jsonForm)}
        </FlexCol>
      </FlexRow>
    </>
  );
}
