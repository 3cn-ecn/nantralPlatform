import { Divider, Tab, Tabs } from '@mui/material';

import { NantralPayUser } from '#modules/nantralpay/types/nantralpayUser.type';
import { useTranslation } from '#shared/i18n/useTranslation';

export type TabType = 'home' | 'orders' | 'transactions' | 'order';

interface TabBarProps {
  value?: TabType;
  onChangeValue: (val: TabType) => void;
  user: NantralPayUser;
}

export function TabBar({ value, onChangeValue, user }: TabBarProps) {
  const { t } = useTranslation();

  return (
    <>
      <Tabs
        variant="scrollable"
        onChange={(_, newVal) => onChangeValue(newVal)}
        value={value || 'home'}
        allowScrollButtonsMobile
        sx={{
          '.MuiTabs-scrollButtons.Mui-disabled': { opacity: 0.3 },
        }}
      >
        <Tab label={t('nantralpay.tabs.home')} value={'home'} />
        <Tab label={t('nantralpay.tabs.transactions')} value={'transactions'} />
        <Tab label={t('nantralpay.tabs.order')} value={'order'} />
        <Tab label={t('nantralpay.tabs.orderList')} value={'orders'} />
      </Tabs>
      <Divider />
    </>
  );
}
