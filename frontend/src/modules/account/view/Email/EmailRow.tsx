import {
  CheckCircleOutlined,
  School,
  Star,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { Chip, TableCell, TableRow, Tooltip, Typography } from '@mui/material';

import { Email } from '#modules/account/email.type';
import { InvalidChip } from '#modules/account/view/Email/InvalidChip';
import { MoreActionButton } from '#modules/account/view/Email/MoreActionButton';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

export function EmailRow({
  email,
  setSelectedEmail,
  changeVisibility,
  setAnchorEl,
}: {
  email: Email;
  setSelectedEmail: (email: Email) => void;
  changeVisibility: (emailUuid: string, isVisible: boolean) => void;
  setAnchorEl: (anchorEl: null | HTMLElement) => void;
}) {
  const { t } = useTranslation();

  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell colSpan={email.isMain && email.isValid ? 2 : 1}>
        <FlexRow gap={1} flexWrap={'wrap'} alignItems={'center'}>
          <Typography variant={'h6'}>{email.email}</Typography>
          {email.isValid ? (
            <Chip
              icon={<CheckCircleOutlined />}
              label={t('email.chip.verified')}
              color={'success'}
              size={'small'}
            />
          ) : (
            <InvalidChip email={email} />
          )}
          {email.isECNEmail && (
            <Tooltip title={t('email.chip.ecnTooltip')}>
              <Chip
                icon={<School />}
                label={t('email.chip.ecn')}
                color={'secondary'}
                size={'small'}
              />
            </Tooltip>
          )}
          {email.isMain && (
            <Tooltip title={t('email.chip.mainTooltip')}>
              <Chip
                icon={<Star />}
                label={t('email.chip.main')}
                color={'primary'}
                size={'small'}
              />
            </Tooltip>
          )}
          <Chip
            icon={email.isVisible ? <Visibility /> : <VisibilityOff />}
            label={
              email.isVisible ? t('email.chip.visible') : t('email.chip.hidden')
            }
            variant={'outlined'}
            color={email.isVisible ? 'primary' : 'secondary'}
            onClick={() => changeVisibility(email.uuid, !email.isVisible)}
            size={'small'}
          />
        </FlexRow>
      </TableCell>

      {(!email.isMain || !email.isValid) && (
        <TableCell>
          <MoreActionButton
            setAnchorEl={setAnchorEl}
            setEmail={setSelectedEmail}
            email={email}
          />
        </TableCell>
      )}
    </TableRow>
  );
}
