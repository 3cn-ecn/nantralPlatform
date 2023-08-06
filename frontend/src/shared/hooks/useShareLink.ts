import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';

export function useShareLink() {
  const showToast = useToast();
  const { t } = useTranslation();

  const showSuccessToast = async () => {
    showToast({
      message: t('utils.shareLink.success'),
      variant: 'success',
    });
  };

  const showErrorToast = async () => {
    showToast({
      message: t('utils.shareLink.failure'),
      variant: 'error',
    });
  };

  const writeToClipboard = async (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => showSuccessToast())
      .catch(() => showErrorToast());
  };

  const shareLink = async (url: string) => {
    // we prefer to use the share menu if available
    if (navigator.share) {
      return navigator.share({ url });
    }
    // check if clipboard api exists
    if (!navigator.clipboard) {
      return showErrorToast();
    }
    // if the browser does not have a permission system, force try to copy
    if (!navigator.permissions) {
      return writeToClipboard(url);
    }
    // if the browser has permissions system
    navigator.permissions
      .query({ name: 'clipboard-write' as PermissionName })
      // if the browser uses clipboard permissions
      .then((result) => {
        if (result.state === 'granted' || result.state === 'prompt') {
          // permission accepted
          writeToClipboard(url);
        } else {
          // permission rejected
          showErrorToast();
        }
      })
      // if the browser does not use clipboard permission
      .catch(() => writeToClipboard(url));
  };

  return { shareLink };
}
