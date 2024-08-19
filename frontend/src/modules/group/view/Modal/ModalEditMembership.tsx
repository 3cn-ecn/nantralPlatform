import { FormEvent, useState } from 'react';

import { Edit, MoreHoriz } from '@mui/icons-material';
import {
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { editMembershipApi } from '#modules/group/api/editMembership.api';
import { convertMembershipToForm } from '#modules/group/hooks/useMembershipFormValues';
import { MembershipFormDTO } from '#modules/group/infra/membership.dto';
import { CreateGroupForm } from '#modules/group/types/group.types';
import {
  Membership,
  MembershipForm,
} from '#modules/group/types/membership.types';
import { useCurrentUserData } from '#modules/student/hooks/useCurrentUser.data';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
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

import { MembershipFormFields } from '../shared/MembershipFormFields';

export function ModalEditMembership({
  onClose,
  membership,
}: {
  onClose: () => void;
  membership: Membership;
}) {
  const { t } = useTranslation();
  const today = new Date();
  const oneYear = new Date();
  oneYear.setFullYear(today.getFullYear() + 1);
  const [formValues, setFormValues] = useState<MembershipForm>(
    convertMembershipToForm(membership),
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const queryClient = useQueryClient();
  const { palette } = useTheme();
  const { staff } = useCurrentUserData();
  const { error, isError, mutate, isLoading } = useMutation<
    Membership,
    ApiFormError<MembershipFormDTO>,
    MembershipForm
  >(() => editMembershipApi(membership.id, formValues), {
    onSuccess: () => {
      queryClient.invalidateQueries(['group', { slug: membership.group.slug }]);
      queryClient.invalidateQueries([
        'members',
        { slug: membership.group.slug },
      ]);
      queryClient.invalidateQueries([
        'membership',
        { group: membership.group.slug, student: membership.student.id },
      ]);
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
    <ResponsiveDialog onClose={onClose} disableEnforceFocus maxWidth="sm">
      <ResponsiveDialogHeader
        onClose={onClose}
        leftIcon={
          <Avatar sx={{ backgroundColor: palette.primary.main }}>
            <Edit />
          </Avatar>
        }
      >
        {membership.student.name}
        <Spacer flex={1} />
      </ResponsiveDialogHeader>
      <ResponsiveDialogContent>
        <form id="edit-group-form" onSubmit={(e) => onSubmit(e)}>
          <MembershipFormFields
            isError={isError}
            error={error}
            formValues={formValues}
            updateFormValues={updateFormValues}
            isAdmin={membership.admin || staff}
          />
        </form>
        <FlexRow justifyContent={'left'}>
          <IconButton onClick={handleClick}>
            <MoreHoriz />
          </IconButton>
          <Menu
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left', // Anchor menu to the left of the button
            }}
          >
            <MenuItem>
              <Typography color="primary">Supprimer</Typography>
            </MenuItem>
          </Menu>
        </FlexRow>
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
