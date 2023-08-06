import { ErrorPageContent } from '#shared/components/ErrorPageContent/ErrorPageContent';
import { PageTemplate } from '#shared/components/PageTemplate/PageTemplate';
import { useTranslation } from '#shared/i18n/useTranslation';

/**
 * The 404 error page when the requested page is not found.
 *
 * @returns The NotFound component
 */
export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <PageTemplate>
      <ErrorPageContent
        status={404}
        message={t('error.notFoundMessage')}
        retryFn={() => window.location.reload()}
      />
    </PageTemplate>
  );
}
