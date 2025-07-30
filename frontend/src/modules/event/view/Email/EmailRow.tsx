import {
  CheckCircleOutlined,
  DeleteForever,
  ErrorOutline,
  School,
  StarOutline,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { Chip, TableCell, TableRow, Tooltip, Typography } from '@mui/material';

import { Email } from '#modules/account/email.type';
import { ResendChip } from '#modules/event/view/Email/ResendChip';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

export function EmailRow({
  email,
  setDeleteModalEmail,
  setNewMainEmail,
  changeVisibility,
}: {
  email: Email;
  setDeleteModalEmail: (email: Email) => void;
  setNewMainEmail: (email: Email) => void;
  changeVisibility: (emailId: number, isVisible: boolean) => void;
}) {
  const { t } = useTranslation();

  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell>
        <FlexRow gap={1} flexWrap={'wrap'}>
          <Typography variant={'h5'}>{email.email}</Typography>
          {email.isValid ? (
            <Chip
              icon={<CheckCircleOutlined />}
              label={t('email.chip.verified')}
              color={'success'}
            />
          ) : (
            <>
              <Chip
                icon={<ErrorOutline />}
                label={t('email.chip.unverified')}
                color={'primary'}
              />
              <ResendChip email={email} />
            </>
          )}
          {email.isECNEmail && (
            <Tooltip title={t('email.chip.ecnTooltip')}>
              <Chip
                icon={<School />}
                label={t('email.chip.ecn')}
                color={'info'}
              />
            </Tooltip>
          )}
          {email.isMain ? (
            <Tooltip title={t('email.chip.mainTooltip')}>
              <Chip
                icon={<StarOutline />}
                label={t('email.chip.main')}
                color={'warning'}
              />
            </Tooltip>
          ) : (
            <>
              {email.isValid && (
                <Tooltip title={t('email.chip.setMainTooltip')}>
                  <Chip
                    icon={<StarOutline />}
                    label={t('email.chip.setMain')}
                    color={'warning'}
                    variant={'outlined'}
                    onClick={() => setNewMainEmail(email)}
                  />
                </Tooltip>
              )}
              <Chip
                icon={<DeleteForever />}
                label={t('button.delete')}
                color={'error'}
                variant={'outlined'}
                onClick={() => setDeleteModalEmail(email)}
              />
            </>
          )}
          <Chip
            icon={email.isVisible ? <Visibility /> : <VisibilityOff />}
            label={'Visibilité'}
            variant={email.isVisible ? 'filled' : 'outlined'}
            onClick={() => changeVisibility(email.id, !email.isVisible)}
          />
        </FlexRow>
      </TableCell>
    </TableRow>
  );
}
