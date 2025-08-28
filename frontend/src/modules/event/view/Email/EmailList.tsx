import { useState } from 'react';

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { changeEmailVisibilityApi } from '#modules/account/api/changeEmailVisibility.api';
import { changeMainEmailApi } from '#modules/account/api/changeMainEmail.api';
import { getEmailListApi } from '#modules/account/api/getEmailList';
import { removeEmailApi } from '#modules/account/api/removeEmail.api';
import { Email } from '#modules/account/email.type';
import { ChangeMainEmailModal } from '#modules/event/view/Email/ChangeMainEmailModal';
import { EmailTable } from '#modules/event/view/Email/EmailTable';
import { InfiniteList } from '#shared/components/InfiniteList/InfiniteList';
import { ConfirmationModal } from '#shared/components/Modal/ConfirmationModal';
import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiError, ApiFormError } from '#shared/infra/errors';

export function EmailList() {
  const showToast = useToast();
  const queryClient = useQueryClient();
  const query = useInfiniteQuery({
    queryFn: ({ pageParam = 1 }) =>
      getEmailListApi({
        page: pageParam,
        pageSize: 10,
      }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
    queryKey: ['emails'],
  });
  const { t } = useTranslation();
  const [deleteModalEmail, setDeleteModalEmail] = useState<Email | null>(null);
  const deleteEmailMutation = useMutation<number, ApiError, string>({
    mutationFn: removeEmailApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries(['emails']);
      setDeleteModalEmail(null);
    },
  });

  const changeVisibility = useMutation<
    string,
    ApiFormError<{ isVisible: boolean }>,
    { emailUuid: string; isVisible: boolean }
  >({
    mutationFn: ({ emailUuid, isVisible }) =>
      changeEmailVisibilityApi(emailUuid, isVisible),
    onSuccess: async (message) => {
      await queryClient.invalidateQueries(['emails']);
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

  const [newMainEmail, setNewMainEmail] = useState<Email | null>(null);

  const changeEmailMutation = useMutation<
    string,
    ApiFormError<{ email: string; password: string }>,
    { email: string; password: string }
  >({
    mutationFn: ({ email, password }) => changeMainEmailApi(email, password),
    onSuccess: async (message) => {
      showToast({
        message: message,
        variant: 'success',
      });
      await queryClient.invalidateQueries(['emails']);
      changeEmailMutation.reset();
      setNewMainEmail(null);
    },
    onError: (error) => {
      if (error.fields?.email) {
        showToast({
          message:
            "Erreur sur l'adresse sélectionnée" + error.fields.email.join(', '),
          variant: 'error',
        });
        changeEmailMutation.reset();
        setNewMainEmail(null);
      }
    },
  });

  return (
    <>
      <InfiniteList query={query}>
        <EmailTable
          isLoading={query.isLoading}
          emails={query.data?.pages.flatMap((page) => page.results)}
          setDeleteModalEmail={setDeleteModalEmail}
          setNewMainEmail={setNewMainEmail}
          changeVisibility={(emailUuid, isVisible) =>
            changeVisibility.mutate({ emailUuid, isVisible })
          }
        />
      </InfiniteList>
      {deleteModalEmail && (
        <ConfirmationModal
          title={t('email.deleteModal.title')}
          body={t('email.deleteModal.body', { email: deleteModalEmail.email })}
          onCancel={() => setDeleteModalEmail(null)}
          onConfirm={() => deleteEmailMutation.mutate(deleteModalEmail?.uuid)}
          loading={deleteEmailMutation.isLoading}
        />
      )}
      {newMainEmail && (
        <ChangeMainEmailModal
          email={newMainEmail}
          mutate={changeEmailMutation.mutate}
          onCancel={() => {
            setNewMainEmail(null);
            changeEmailMutation.reset();
          }}
          reset={changeEmailMutation.reset}
          isLoading={changeEmailMutation.isLoading}
        />
      )}
    </>
  );
}
