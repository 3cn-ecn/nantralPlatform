import { FormEvent, useEffect, useState } from 'react';

import {
  Check,
  Edit,
  Groups,
  Save,
  Settings,
  Share,
} from '@mui/icons-material';
import { Avatar, Tab, Tabs, useTheme } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateGroupApi } from '#modules/group/api/updateGroup.api';
import { useGroupFormValues } from '#modules/group/hooks/useGroupFormValues';
import { CreateGroupForm, Group } from '#modules/group/types/group.types';
import { GroupFormFields } from '#modules/group/view/shared/GroupFormFields';
import { EditSocialLinkForm } from '#modules/social_link/view/shared/EditSocialLinkForm';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
} from '#shared/components/ResponsiveDialog';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

import { EditMembersView } from '../EditMembersView/EditMembersView';

export function ModalEditGroup({
  onClose,
  group,
}: {
  onClose: () => void;
  group: Group;
}) {
  const { t } = useTranslation();
  const groupValues = useGroupFormValues(group);

  const [formValues, setFormValues] = useState<CreateGroupForm>(groupValues);

  const [tab, setTab] = useState(0);
  const [changes, setChanges] = useState(false);
  const queryClient = useQueryClient();
  const { palette } = useTheme();
  const { error, isError, mutate, isLoading } = useMutation<
    Group,
    ApiFormError<CreateGroupForm>,
    CreateGroupForm
  >(() => updateGroupApi(group.slug, formValues), {
    onSuccess: () => {
      queryClient.invalidateQueries(['group', { slug: group.slug }]);
      setChanges(false);
    },
  });

  function updateFormValues(val: Partial<CreateGroupForm>) {
    setFormValues({ ...formValues, ...val });
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate(formValues);
  }

  useEffect(() => {
    setChanges(true);
  }, [formValues]);

  return (
    <ResponsiveDialog onClose={onClose} disableEnforceFocus>
      <ResponsiveDialogHeader
        onClose={onClose}
        leftIcon={
          <Avatar sx={{ bgcolor: palette.primary.main }}>
            <Edit />
          </Avatar>
        }
      >
        {t('group.details.modal.editGroup.title')}
      </ResponsiveDialogHeader>
      <div style={{ position: 'relative', maxHeight: 100 }}>
        <Tabs value={tab} onChange={(e, val) => setTab(val)}>
          <Tab
            label={t('group.details.modal.editGroup.tabs.general')}
            iconPosition="start"
            icon={<Settings />}
          />
          <Tab
            label={t('group.details.modal.editGroup.tabs.members')}
            iconPosition="start"
            icon={<Groups />}
          />
          <Tab
            label={t('group.details.modal.editGroup.tabs.links')}
            iconPosition="start"
            icon={<Share />}
          />
        </Tabs>
      </div>
      <ResponsiveDialogContent sx={{ height: 800 }}>
        {tab == 0 && (
          <>
            <form id="edit-group-form" onSubmit={(e) => onSubmit(e)}>
              <GroupFormFields
                isError={isError}
                error={error}
                formValues={formValues}
                updateFormValues={updateFormValues}
                groupType={group.groupType.slug}
                prevData={group}
                edit
              />
            </form>
            <FlexRow my={2} justifyContent={'end'}>
              <LoadingButton
                form="edit-group-form"
                type="submit"
                loading={isLoading}
                variant="contained"
                disabled={!changes}
                startIcon={changes && <Save />}
                endIcon={!changes && <Check />}
              >
                {!changes ? t('button.saved') : t('button.save')}
              </LoadingButton>
            </FlexRow>
          </>
        )}
        {tab == 1 && <EditMembersView group={group} />}
        {tab == 2 && (
          <EditSocialLinkForm
            socialLinks={group.socialLinks}
            groupSlug={group.slug}
          />
        )}
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
