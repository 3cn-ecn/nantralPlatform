import { ErrorPageContent } from '#shared/components/ErrorPageContent/ErrorPageContent';
import { useTranslation } from '#shared/i18n/useTranslation';

/**
 * The 404 error page when the requested page is not found.
 *
 * @returns The NotFound component
 */
export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <ErrorPageContent
      status={404}
      message={t('error.notFoundMessage')}
      retryFn={() => window.location.reload()}
    />
  );
}
