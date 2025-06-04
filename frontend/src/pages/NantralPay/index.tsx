import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Container } from '@mui/material';

import { getNantralPayUserApi } from '#modules/nantralpay/api/getNantralPayUser.api';
import { NantralPayUser } from '#modules/nantralpay/types/nantralpayUser.type';
import { usePostQueryParamState } from '#modules/post/hooks/usePostQueryParamState';
import { PostModal } from '#modules/post/view/PostModal/PostModal';
import { NantralPayInfo } from '#pages/NantralPay/components/NantralPayInfo';
import { useNantralPay } from '#pages/NantralPay/hooks/useNantralPay';
import PlaceOrderTab from '#pages/NantralPay/tabs/PlaceOrder.tab';
import RefillAccountTab from '#pages/NantralPay/tabs/RefillAccount.tab';
import TransactionListTab from '#pages/NantralPay/tabs/TransactionList.tab';
import { ErrorPageContent } from '#shared/components/ErrorPageContent/ErrorPageContent';
import { Spacer } from '#shared/components/Spacer/Spacer';

import { TabBar, TabType } from './TabBar';
import OrderListTab from './tabs/OrderList.tab';

export default function NantralPayHomePage({ tab }: { tab: TabType }) {
  const navigate = useNavigate();
  const { postId, closePost } = usePostQueryParamState();
  const [nantralpayUser, setNantralPayUser] = useState<NantralPayUser>();

  useEffect(() => {
    getNantralPayUserApi().then((npUser) => setNantralPayUser(npUser));
  }, []);

  return (
    <>
      <Container sx={{ mb: 2 }}>
        <NantralPayInfo nantralpayUser={nantralpayUser} />
        {nantralpayUser && (
          <TabBar
            value={tab}
            user={nantralpayUser}
            onChangeValue={(val: TabType) => {
              if (val == 'home') {
                navigate('/nantralpay/');
              } else {
                navigate(`/nantralpay/${val}/`);
              }
            }}
          />
        )}
        <Spacer vertical={2} />
        {tab == 'home' && <div />}
        {tab == 'order' && <PlaceOrderTab />}
        {tab == 'orders' && <OrderListTab />}
        {tab == 'refill' && <RefillAccountTab />}
      </Container>
      {postId && <PostModal postId={postId} onClose={closePost} />}
    </>
  );
}
