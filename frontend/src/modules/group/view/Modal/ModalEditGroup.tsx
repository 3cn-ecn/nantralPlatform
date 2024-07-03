import { FormEvent, useState } from 'react';

import { Edit } from '@mui/icons-material';
import { Button, Tab, Tabs } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateGroupApi } from '#modules/group/api/updateGroup.api';
import { useGroupFormValues } from '#modules/group/hooks/useGroupFormValues';
import { CreateGroupForm, Group } from '#modules/group/types/group.types';
import { Membership } from '#modules/group/types/membership.types';
import { GroupFormFields } from '#modules/group/view/shared/GroupFormFields';
import { EditSocialLinkForm } from '#modules/social_link/view/shared/EditSocialLinkForm';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
} from '#shared/components/ResponsiveDialog';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

import { EditMembersView } from '../EditMembersView/EditMembersView';

export function ModalEditGroup({
  onClose,
  group,
  members,
}: {
  onClose: () => void;
  group: Group;
  members: Membership[];
}) {
  const { t } = useTranslation();
  const groupValues = useGroupFormValues(group);

  const [formValues, setFormValues] = useState<CreateGroupForm>(groupValues);

  const [tab, setTab] = useState(0);
  const queryClient = useQueryClient();

  const { error, isError, mutate, isLoading } = useMutation<
    Group,
    ApiFormError<CreateGroupForm>,
    CreateGroupForm
  >(() => updateGroupApi(group.slug, formValues), {
    onSuccess: () => {
      queryClient.invalidateQueries(['group', { slug: group.slug }]);
      onClose();
    },
  });

  function updateFormValues(val: Partial<CreateGroupForm>) {
    setFormValues({ ...formValues, ...val });
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate(formValues);
  }

  return (
    <ResponsiveDialog onClose={onClose} disableEnforceFocus>
      <ResponsiveDialogHeader
        onClose={onClose}
        leftIcon={<Edit />}
        // helpUrl="https://docs.nantral-platform.fr/user/posts-events/create-event"
      >
        Modifier le groupe
        <Spacer flex={1} />
      </ResponsiveDialogHeader>
      <ResponsiveDialogContent>
        <Tabs value={tab} onChange={(e, val) => setTab(val)} sx={{ mb: 2 }}>
          <Tab label="Général" />
          <Tab label="Réseau sociaux" />
          <Tab label="Membres" />
        </Tabs>
        {tab == 0 && (
          <form id="edit-group-form" onSubmit={(e) => onSubmit(e)}>
            <GroupFormFields
              isError={isError}
              error={error}
              formValues={formValues}
              updateFormValues={updateFormValues}
              groupType={group.groupType.slug}
              prevData={group}
            />
          </form>
        )}
        {tab == 1 && (
          <EditSocialLinkForm
            socialLinks={group.socialLinks}
            groupSlug={group.slug}
          />
        )}
        {tab == 2 && <EditMembersView members={members} />}
      </ResponsiveDialogContent>
      <ResponsiveDialogFooter>
        <Button variant="text" onClick={() => onClose()}>
          {t('button.cancel')}
        </Button>
        <LoadingButton
          form="edit-group-form"
          type="submit"
          loading={isLoading}
          variant="contained"
        >
          {t('button.confirm')}
        </LoadingButton>
      </ResponsiveDialogFooter>
    </ResponsiveDialog>
  );
}
