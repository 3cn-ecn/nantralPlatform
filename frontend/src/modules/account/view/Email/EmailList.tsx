import { useState } from 'react';

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { changeEmailVisibilityApi } from '#modules/account/api/changeEmailVisibility.api';
import { getEmailListApi } from '#modules/account/api/getEmailList';
import { Email } from '#modules/account/email.type';
import { EmailTable } from '#modules/account/view/Email/EmailTable';
import { MoreActionMenu } from '#modules/account/view/Email/MoreActionMenu';
import { InfiniteList } from '#shared/components/InfiniteList/InfiniteList';
import { useToast } from '#shared/context/Toast.context';
import { ApiFormError } from '#shared/infra/errors';

export function EmailList() {
  const showToast = useToast();
  const queryClient = useQueryClient();
  const query = useInfiniteQuery({
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getEmailListApi({
        page: pageParam,
        pageSize: 10,
      }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
    queryKey: ['emails'],
  });
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const changeVisibility = useMutation<
    string,
    ApiFormError<{ isVisible: boolean }>,
    { emailUuid: string; isVisible: boolean }
  >({
    mutationFn: ({ emailUuid, isVisible }) =>
      changeEmailVisibilityApi(emailUuid, isVisible),
    onSuccess: async (message) => {
      await queryClient.invalidateQueries({
        queryKey: ['emails'],
      });
      showToast({
        message: message,
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
          isPending={query.isPending}
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
