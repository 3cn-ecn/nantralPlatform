import { FormEvent, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  Check,
  Edit,
  GridView,
  Groups,
  Save,
  Settings,
  Share,
} from '@mui/icons-material';
import { Avatar, Tab, Tabs, useTheme } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateGroupApi } from '#modules/group/api/updateGroup.api';
import { useGroupFormValues } from '#modules/group/hooks/useGroupFormValues';
import { CreateGroupFormDTO } from '#modules/group/infra/group.dto';
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

import { EditChildrenView } from '../EditChildrenView/EditChildrenView';
import { EditMembersView } from '../EditMembersView/EditMembersView';

export function ModalEditGroup({
  onClose,
  group,
}: {
  onClose: () => void;
  group: Group;
}) {
  const { t } = useTranslation();
  const groupValues = useGroupFormValues({ group: group });

  const [formValues, setFormValues] = useState<CreateGroupForm>(groupValues);

  const [tab, setTab] = useState(0);
  const [hasModifications, setHasModifications] = useState(false);
  const queryClient = useQueryClient();
  const { palette } = useTheme();
  const [, setSerachParams] = useSearchParams();
  const { error, isError, mutate, isPending } = useMutation<
    Group,
    ApiFormError<CreateGroupFormDTO>,
    CreateGroupForm
  >({
    mutationFn: () => updateGroupApi(group.slug, formValues),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['group', { slug: group.slug }],
      });
      queryClient.invalidateQueries({
        queryKey: ['history', { slug: group.slug }],
      });
      setSerachParams({}, { preventScrollReset: true });
      setHasModifications(false);
    },
  });

  function updateFormValues(val: Partial<CreateGroupForm>) {
    setHasModifications(true);
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
        leftIcon={
          <Avatar sx={{ bgcolor: palette.primary.main }}>
            <Edit />
          </Avatar>
        }
      >
        {t('group.details.modal.editGroup.title')}
      </ResponsiveDialogHeader>
      <div style={{ position: 'relative', maxHeight: 100 }}>
        <Tabs
          variant="scrollable"
          value={tab}
          onChange={(e, val) => setTab(val)}
          allowScrollButtonsMobile
        >
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
          {!group.parent && group.groupType.canHaveParent && (
            <Tab
              label={t('group.details.modal.editGroup.tabs.subgroups')}
              iconPosition="start"
              icon={<GridView />}
            />
          )}
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
                groupType={group.groupType}
                prevData={group}
                edit
              />
            </form>
            <FlexRow my={2} justifyContent={'end'}>
              <LoadingButton
                form="edit-group-form"
                type="submit"
                loading={isPending}
                variant="contained"
                disabled={!hasModifications}
                startIcon={hasModifications && <Save />}
                endIcon={!hasModifications && <Check />}
              >
                {!hasModifications ? t('button.saved') : t('button.save')}
              </LoadingButton>
            </FlexRow>
          </>
        )}
        {tab == 1 && <EditMembersView group={group} />}
        {tab == 2 && (
          <EditSocialLinkForm
            socialLinks={group.socialLinks}
            groupSlug={group.slug}
            type="group"
            onSuccess={() =>
              queryClient.invalidateQueries({
                queryKey: ['group', { slug: group.slug }],
              })
            }
          />
        )}
        {tab == 3 && <EditChildrenView group={group} />}
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
