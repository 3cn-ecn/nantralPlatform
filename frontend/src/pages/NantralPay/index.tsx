import { useNavigate } from 'react-router-dom';

import { Container } from '@mui/material';

import { usePostQueryParamState } from '#modules/post/hooks/usePostQueryParamState';
import { PostModal } from '#modules/post/view/PostModal/PostModal';
import { NantralPayInfo } from '#pages/NantralPay/components/NantralPayInfo';
import { useNantralPay } from '#pages/NantralPay/hooks/useNantralPay';
import PlaceOrderTab from '#pages/NantralPay/tabs/PlaceOrder.tab';
import TransactionListTab from '#pages/NantralPay/tabs/TransactionList.tab';
import { ErrorPageContent } from '#shared/components/ErrorPageContent/ErrorPageContent';
import { Spacer } from '#shared/components/Spacer/Spacer';

import { TabBar, TabType } from './TabBar';
import OrderListTab from './tabs/OrderList.tab';

export default function NantralPayHomePage({ tab }: { tab: TabType }) {
  const navigate = useNavigate();
  const { postId, closePost } = usePostQueryParamState();

  const {
    nantralpayUser,
    transactions,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    isSuccess,
  } = useNantralPay();

  if (isError && error) {
    return (
      <ErrorPageContent
        status={error.status}
        errorMessage={error.message}
        retryFn={refetch}
      />
    );
  }

  return (
    <>
      <Container sx={{ mb: 2 }}>
        <NantralPayInfo nantralpayUser={nantralpayUser} />
        {nantralpayUser && isSuccess && (
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
        {transactions && tab == 'transactions' && (
          <TransactionListTab
            transactions={transactions}
            isLoading={isLoading}
            isFetching={isFetching}
            isSuccess={isSuccess}
          />
        )}
        {tab == 'order' && <PlaceOrderTab />}
        {tab == 'orders' && <OrderListTab />}
      </Container>
      {postId && <PostModal postId={postId} onClose={closePost} />}
    </>
  );
}
