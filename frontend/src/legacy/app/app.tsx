import { NotificationMenu } from '#modules/notification/view/NotificationMenu/NotificationMenu';
import { AppMenu } from '#shared/components/PageTemplate/components/AppMenu';
import { UserMenu } from '#shared/components/PageTemplate/components/UserMenu';
import { UserMenuUnauthenticated } from '#shared/components/PageTemplate/components/UserMenuUnauthenticated';

import { wrapAndRenderLegacyCode } from '../utils/wrapAndRenderLegacyCode';
import { AppInstallBanner } from './appInstallBanner';
import redirectToLoginPage from './redirectToLoginPage';
import registerSw from './registerSw';

registerSw();
redirectToLoginPage();

wrapAndRenderLegacyCode(<AppInstallBanner />, 'footer-install-app');
wrapAndRenderLegacyCode(<NotificationMenu />, 'notificationPanel');
wrapAndRenderLegacyCode(<AppMenu />, 'appMenu');
wrapAndRenderLegacyCode(<UserMenu />, 'userMenu');
wrapAndRenderLegacyCode(<UserMenuUnauthenticated />, 'userMenuUnauthenticated');
