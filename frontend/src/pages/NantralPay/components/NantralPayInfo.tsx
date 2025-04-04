import { Typography } from '@mui/material';

import { NantralPayUser } from '#modules/nantralpay/types/nantralpayUser.type';
import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useBreakpoint } from '#shared/hooks/useBreakpoint';
import { useTranslation } from '#shared/i18n/useTranslation';

export function NantralPayInfo({
  nantralpayUser,
}: {
  nantralpayUser?: NantralPayUser;
}) {
  const { t } = useTranslation();
  const { isSmaller } = useBreakpoint('sm');

  return (
    <FlexRow
      columnGap={4}
      rowGap={2}
      mt={3}
      mb={2}
      flexWrap={isSmaller ? 'wrap' : 'nowrap'}
    >
      <FlexCol>
        <FlexRow gap={1} alignItems="center">
          <Typography variant="h1">{t('nantralpay.title')}</Typography>
        </FlexRow>
        {nantralpayUser && (
          <FlexRow gap={1} alignItems="center">
            <Typography variant="h2">
              {t('nantralpay.balance', { balance: nantralpayUser.balance })}
            </Typography>
          </FlexRow>
        )}
      </FlexCol>
    </FlexRow>
  );
}
