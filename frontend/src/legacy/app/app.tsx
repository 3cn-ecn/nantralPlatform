import { NotificationMenu } from '#modules/notification/view/NotificationMenu/NotificationMenu';
import { UserMenuAuthenticated } from '#shared/components/PageTemplate/UserMenu/UserMenuAuthenticated';
import { UserMenuUnauthenticated } from '#shared/components/PageTemplate/UserMenu/UserMenuUnauthenticated';

import { wrapAndRenderLegacyCode } from '../utils/wrapAndRenderLegacyCode';
import { AppInstallBanner } from './appInstallBanner';
import registerSw from './registerSw';

registerSw();
wrapAndRenderLegacyCode(<AppInstallBanner />, 'footer-install-app');
wrapAndRenderLegacyCode(<NotificationMenu />, 'notificationPanel');
wrapAndRenderLegacyCode(<UserMenuAuthenticated />, 'userMenu');
wrapAndRenderLegacyCode(<UserMenuUnauthenticated />, 'userMenuUnauthenticated');
