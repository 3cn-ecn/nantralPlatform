import { useState } from 'react';

import { AddBox, Delete, Edit, ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createGroupSocialLinkApi } from '#modules/social_link/api/createGroupSocialLink.api';
import { deleteSocialLinkApi } from '#modules/social_link/api/deleteSocialLink.api';
import { updateSocialLinkApi } from '#modules/social_link/api/updateGroupSocialLink.api';
import { SocialLinkDTO } from '#modules/social_link/infra/socialLink.dto';
import {
  SocialLink,
  SocialLinkForm,
} from '#modules/social_link/types/socialLink.type';
import { sortLinks } from '#modules/social_link/utils/sortLinks';
import { SocialLinkFormFields } from '#modules/social_link/view/shared/SocialLinkFormFields';
import { FlexCol } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

import { SocialLinkItem } from './SocialLinkItem';

interface EditSocialLinkFormProps {
  socialLinks: SocialLink[];
  groupSlug?: string;
}

export function EditSocialLinkForm({
  socialLinks,
  groupSlug,
}: EditSocialLinkFormProps) {
  const sortedSocialLinks = sortLinks(socialLinks);

  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [expanded, setExpanded] = useState<number | undefined>(undefined);
  const [socialLinkForm, setSocialLinkForm] = useState<SocialLinkForm>({
    label: '',
    uri: '',
  });

  function onSuccess() {
    setExpanded(undefined);
    groupSlug &&
      queryClient.invalidateQueries(['group', { slug: groupSlug || '' }]);
  }

  const {
    error: socialLinkError,
    isError: socialLinkIsError,
    mutate: updateSocialLink,
  } = useMutation<SocialLinkForm, ApiFormError<SocialLinkDTO>, SocialLinkForm>(
    (val) => updateSocialLinkApi(val),
    {
      onSuccess: onSuccess,
    },
  );

  const { mutate: deleteSocialLink } = useMutation<
    unknown,
    ApiFormError<SocialLinkDTO>,
    SocialLinkForm
  >((val) => deleteSocialLinkApi(val.id || -1), {
    onSuccess: onSuccess,
  });

  const {
    error: createError,
    isError: createIsError,
    mutate: createSocialLink,
  } = useMutation<SocialLinkForm, ApiFormError<SocialLinkDTO>, SocialLinkForm>(
    (val) => createGroupSocialLinkApi(groupSlug || '', val),
    {
      onSuccess: () => {
        onSuccess();
      },
    },
  );

  return (
    <FlexCol gap={2}>
      {sortedSocialLinks.map((socialLink, index) => (
        <form
          key={socialLink.id}
          onSubmit={(e) => {
            e.preventDefault();
            updateSocialLink(socialLinkForm);
          }}
        >
          <Accordion
            expanded={expanded === socialLink.id}
            onChange={(_, isExpanded) => {
              const val = socialLinks[index];
              if (isExpanded) {
                setSocialLinkForm({
                  label: val.label,
                  uri: val.uri,
                  id: val.id,
                });
              }
              setExpanded(isExpanded ? socialLink.id : undefined);
            }}
          >
            <AccordionSummary
              expandIcon={expanded == socialLink.id ? <ExpandMore /> : <Edit />}
            >
              <SocialLinkItem socialLink={socialLink} />
            </AccordionSummary>
            <AccordionDetails>
              <SocialLinkFormFields
                isError={socialLinkIsError}
                error={socialLinkError}
                formValues={socialLinkForm}
                updateFormValues={(val) => {
                  setSocialLinkForm({ ...socialLinkForm, ...val });
                }}
              />
            </AccordionDetails>
            <AccordionActions>
              <Button type="submit" variant="contained">
                {t('socialLink.apply')}
              </Button>
              <Button
                startIcon={<Delete />}
                variant="outlined"
                onClick={() => deleteSocialLink(socialLinkForm)}
              >
                {t('socialLink.delete')}
              </Button>
            </AccordionActions>
          </Accordion>
        </form>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createSocialLink(socialLinkForm);
        }}
      >
        <Accordion
          expanded={expanded === -1}
          onChange={(_, isExpanded) => {
            if (isExpanded) {
              setSocialLinkForm({
                label: '',
                uri: '',
              });
            }
            setExpanded(isExpanded ? -1 : undefined);
          }}
        >
          <AccordionSummary
            expandIcon={expanded == -1 ? <ExpandMore /> : <AddBox />}
          >
            {t('socialLink.add')}
          </AccordionSummary>
          <AccordionDetails>
            <SocialLinkFormFields
              isError={createIsError}
              error={createError}
              formValues={socialLinkForm}
              updateFormValues={(val) => {
                setSocialLinkForm({ ...socialLinkForm, ...val });
              }}
            />
          </AccordionDetails>
          <AccordionActions>
            <Button type="submit" variant="contained">
              {t('socialLink.add')}
            </Button>
          </AccordionActions>
        </Accordion>
      </form>
    </FlexCol>
  );
}
