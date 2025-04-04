import { Container } from '@mui/material';

import { usePostQueryParamState } from '#modules/post/hooks/usePostQueryParamState';
import { PostModal } from '#modules/post/view/PostModal/PostModal';
import { NantralPayInfo } from '#pages/NantralPay/components/NantralPayInfo';
import { useNantralPay } from '#pages/NantralPay/hooks/useNantralPay';
import PlaceOrderTab from '#pages/NantralPay/tabs/PlaceOrder.tab';
import TransactionListTab from '#pages/NantralPay/tabs/TransactionList.tab';
import { ErrorPageContent } from '#shared/components/ErrorPageContent/ErrorPageContent';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useQueryParamState } from '#shared/hooks/useQueryParamState';

import { TabBar, TabType } from './TabBar';

export default function NantralPayHomePage() {
  const [selectedTab, setSelectedTab] = useQueryParamState<TabType>(
    'tab',
    'home',
  );
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
            value={selectedTab}
            user={nantralpayUser}
            onChangeValue={(val: TabType) => {
              setSelectedTab(val);
            }}
          />
        )}
        <Spacer vertical={2} />
        {selectedTab == 'home' && <div />}
        {transactions && selectedTab == 'transactions' && (
          <TransactionListTab
            transactions={transactions}
            isLoading={isLoading}
            isFetching={isFetching}
            isSuccess={isSuccess}
          />
        )}
        {selectedTab == 'order' && <PlaceOrderTab />}
      </Container>
      {postId && <PostModal postId={postId} onClose={closePost} />}
    </>
  );
}
