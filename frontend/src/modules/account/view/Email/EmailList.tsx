import { useState } from 'react';

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { changeEmailVisibilityApi } from '#modules/account/api/changeEmailVisibility.api';
import { getEmailListApi } from '#modules/account/api/getEmailList.api';
import { Email } from '#modules/account/email.type';
import { EmailDTO } from '#modules/account/infra/email.dto';
import { EmailTable } from '#modules/account/view/Email/EmailTable';
import { MoreActionMenu } from '#modules/account/view/Email/MoreActionMenu';
import { InfiniteList } from '#shared/components/InfiniteList/InfiniteList';
import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

interface EmailListProps {
  userId: number;
}

export function EmailList({ userId }: EmailListProps) {
  const showToast = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const query = useInfiniteQuery({
    queryFn: ({ pageParam = 1 }) =>
      getEmailListApi(
        {
          page: pageParam,
          pageSize: 10,
        },
        userId,
      ),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
    queryKey: ['emails', { userId: userId.toString() }],
  });
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const changeVisibility = useMutation<
    EmailDTO,
    ApiFormError<{ isVisible: boolean }>,
    { emailUuid: string; isVisible: boolean }
  >({
    mutationFn: ({ emailUuid, isVisible }) =>
      changeEmailVisibilityApi(emailUuid, isVisible),
    onSuccess: async (email) => {
      await queryClient.invalidateQueries([
        'emails',
        { userId: userId.toString() },
      ]);
      await queryClient.invalidateQueries(['user', { id: userId.toString() }]);
      await queryClient.invalidateQueries(['user', 'current']);
      showToast({
        message: t(
          `email.visibility.${email.is_visible ? 'setVisible' : 'setHidden'}`,
        ),
        variant: 'success',
      });
    },
    onError: async (error) => {
      showToast({
        message: error.message,
        variant: 'error',
      });
    },
  });

  return (
    <>
      <InfiniteList query={query}>
        <EmailTable
          isLoading={query.isLoading}
          emails={query.data?.pages.flatMap((page) => page.results)}
          setSelectedEmail={setSelectedEmail}
          changeVisibility={(emailUuid, isVisible) =>
            changeVisibility.mutate({ emailUuid, isVisible })
          }
          setAnchorEl={setAnchorEl}
        />
      </InfiniteList>

      <MoreActionMenu
        email={selectedEmail}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
      />
    </>
  );
}
