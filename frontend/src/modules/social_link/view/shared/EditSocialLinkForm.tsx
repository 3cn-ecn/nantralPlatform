import { useEffect, useRef, useState } from 'react';

import {
  Add as AddIcon,
  DeleteForever as DeleteForeverIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { createGroupSocialLinkApi } from '#modules/social_link/api/createGroupSocialLink.api';
import { createUserSocialLinkApi } from '#modules/social_link/api/createUserSocialLink.api';
import { deleteSocialLinkApi } from '#modules/social_link/api/deleteSocialLink.api';
import { updateSocialLinkApi } from '#modules/social_link/api/updateSocialLink.api';
import { SocialLinkDTO } from '#modules/social_link/infra/socialLink.dto';
import {
  SocialLink,
  SocialLinkForm,
} from '#modules/social_link/types/socialLink.type';
import { sortLinks } from '#modules/social_link/utils/sortLinks';
import { SocialLinkFormFields } from '#modules/social_link/view/shared/SocialLinkFormFields';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

import { SocialLinkItem } from './SocialLinkItem';

interface EditSocialLinkFormProps {
  socialLinks: SocialLink[];
  type: 'user' | 'group';
  groupSlug?: string;
  onSuccess?: () => void;
}

export function EditSocialLinkForm({
  socialLinks,
  type,
  groupSlug,
  onSuccess,
}: EditSocialLinkFormProps) {
  const sortedSocialLinks = sortLinks(socialLinks);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  const { t } = useTranslation();

  const [expanded, setExpanded] = useState<number | undefined>(undefined);
  const [socialLinkForm, setSocialLinkForm] = useState<SocialLinkForm>({
    label: '',
    uri: '',
  });

  // hack to scroll to bottom when creating a new item
  useEffect(() => {
    if (expanded === -1) {
      addButtonRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [expanded]);

  // hack to scroll to bottom when creating a new item
  useEffect(() => {
    if (expanded === -1) {
      addButtonRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [expanded]);

  function handleSuccess() {
    setExpanded(undefined);
    onSuccess?.();
  }

  const {
    error: socialLinkError,
    isError: socialLinkIsError,
    mutate: updateSocialLink,
  } = useMutation<SocialLinkForm, ApiFormError<SocialLinkDTO>, SocialLinkForm>(
    (val) => updateSocialLinkApi(val, type),
    {
      onSuccess: handleSuccess,
    },
  );

  const { mutate: deleteSocialLink } = useMutation<
    unknown,
    ApiFormError<SocialLinkDTO>,
    SocialLinkForm
  >((val) => deleteSocialLinkApi(val.id || -1, type), {
    onSuccess: handleSuccess,
  });

  const {
    error: createError,
    isError: createIsError,
    mutate: createSocialLink,
  } = useMutation<SocialLinkForm, ApiFormError<SocialLinkDTO>, SocialLinkForm>(
    (val) =>
      type == 'group'
        ? createGroupSocialLinkApi(groupSlug || '', val)
        : createUserSocialLinkApi(val),
    {
      onSuccess: handleSuccess,
    },
  );

  return (
    <>
      <Box>
        {sortedSocialLinks.map((socialLink, index) => (
          <Accordion
            key={socialLink.id}
            disabled={expanded === -1}
            expanded={expanded === socialLink.id}
            onChange={(_, isExpanded) => {
              if (isExpanded) {
                const val = socialLinks[index];
                setSocialLinkForm({ ...val });
                setExpanded(val.id);
              } else {
                setExpanded(undefined);
              }
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <SocialLinkItem socialLink={socialLink} clickable={false} />
            </AccordionSummary>
            <AccordionDetails>
              <form
                id={`social-link-${socialLink.id}`}
                onSubmit={(e) => {
                  e.preventDefault();
                  updateSocialLink(socialLinkForm);
                }}
              >
                <SocialLinkFormFields
                  isError={socialLinkIsError}
                  error={socialLinkError}
                  formValues={socialLinkForm}
                  updateFormValues={(val) => {
                    setSocialLinkForm({ ...socialLinkForm, ...val });
                  }}
                />
              </form>
            </AccordionDetails>
            <AccordionActions>
              <Button
                startIcon={<DeleteForeverIcon />}
                variant="outlined"
                color="secondary"
                onClick={() => deleteSocialLink(socialLinkForm)}
              >
                {t('button.delete')}
              </Button>
              <Button
                form={`social-link-${socialLink.id}`}
                type="submit"
                variant="contained"
              >
                {t('button.update')}
              </Button>
            </AccordionActions>
          </Accordion>
        ))}
        {expanded === -1 && (
          <Accordion expanded>
            <AccordionSummary>
              <SocialLinkItem
                socialLink={{
                  uri: 'https://no-link',
                  label: t('socialLink.new'),
                }}
                clickable={false}
              />
            </AccordionSummary>
            <AccordionDetails>
              <form
                id="create-social-link"
                onSubmit={(e) => {
                  e.preventDefault();
                  createSocialLink(socialLinkForm);
                }}
              >
                <SocialLinkFormFields
                  isError={createIsError}
                  error={createError}
                  formValues={socialLinkForm}
                  updateFormValues={(val) => {
                    setSocialLinkForm({ ...socialLinkForm, ...val });
                  }}
                />
              </form>
            </AccordionDetails>
            <AccordionActions>
              <Button onClick={() => setExpanded(undefined)}>
                {t('button.cancel')}
              </Button>
              <Button
                type="submit"
                variant="contained"
                form="create-social-link"
              >
                {t('button.add')}
              </Button>
            </AccordionActions>
          </Accordion>
        )}
      </Box>
      <Spacer vertical={3} />
      <FlexRow gap={1}>
        <Button
          startIcon={<AddIcon />}
          ref={addButtonRef}
          variant="contained"
          onClick={() => {
            setExpanded(-1);
            setSocialLinkForm({
              label: '',
              uri: '',
            });
          }}
        >
          {t('socialLink.addLink')}
        </Button>
        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          onClick={() => {
            setExpanded(-1);
            setSocialLinkForm({
              label: '',
              uri: 'mailto:example@example.com',
            });
          }}
        >
          {t('socialLink.addEmail')}
        </Button>
        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          onClick={() => {
            setExpanded(-1);
            setSocialLinkForm({
              label: '',
              uri: 'tel:+33 6 01 01 01 01',
            });
          }}
        >
          {t('socialLink.addPhoneNumber')}
        </Button>
      </FlexRow>
    </>
  );
}
