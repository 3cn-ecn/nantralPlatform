import { Container } from '@mui/material';

import { usePostQueryParamState } from '#modules/post/hooks/usePostQueryParamState';
import { PostModal } from '#modules/post/view/PostModal/PostModal';
import { NantralPayInfo } from '#pages/NantralPay/components/NantralPayInfo';
import { useNantralPay } from '#pages/NantralPay/hooks/useNantralPay';
import PaymentListTab from '#pages/NantralPay/tabs/PaymentList.tab';
import QRCodeFormTab from '#pages/NantralPay/tabs/QRCodeForm.tab';
import TransactionListTab from '#pages/NantralPay/tabs/TransactionList.tab';
import { ErrorPageContent } from '#shared/components/ErrorPageContent/ErrorPageContent';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useQueryParamState } from '#shared/hooks/useQueryParamState';

import { TabBar, TabType } from './TabBar';
import AddItemForm from './tabs/AddItemForm.tab';

export default function NantralPayHomePage() {
  const [selectedTab, setSelectedTab] = useQueryParamState<TabType>(
    'tab',
    'home',
  );
  const { postId, closePost } = usePostQueryParamState();

  const {
    nantralpayUser,
    transactions,
    payments,
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
        {selectedTab == 'qrcode' && <QRCodeFormTab />}
        {payments && selectedTab == 'payments' && (
          <PaymentListTab
            payments={payments}
            isLoading={isLoading}
            isFetching={isFetching}
            isSuccess={isSuccess}
          />
        )}
        {transactions && selectedTab == 'transactions' && (
          <TransactionListTab
            transactions={transactions}
            isLoading={isLoading}
            isFetching={isFetching}
            isSuccess={isSuccess}
          />
        )}
        {selectedTab == 'items' && <AddItemForm />}
      </Container>
      {postId && <PostModal postId={postId} onClose={closePost} />}
    </>
  );
}
