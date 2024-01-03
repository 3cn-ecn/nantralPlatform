import { NotificationMenu } from '#modules/notification/view/NotificationMenu/NotificationMenu';
import { AppMenu } from '#shared/components/PageTemplate/components/NavBarTop/AppMenu';
import { NavBarTop } from '#shared/components/PageTemplate/components/NavBarTop/NavBarTop';

import { wrapAndRenderLegacyCode } from '../utils/wrapAndRenderLegacyCode';
import addAppInstallListener from './appInstallBanner';
import redirectToLoginPage from './redirectToLoginPage';
import registerSw from './registerSw';

// import loadBackButton from "./backButton";

// load all components
registerSw();
redirectToLoginPage();
addAppInstallListener();
// loadBackButton();

wrapAndRenderLegacyCode(<NotificationMenu />, 'notificationPanel');
wrapAndRenderLegacyCode(<AppMenu />, 'appMenu');
wrapAndRenderLegacyCode(<NavBarTop />, 'navBarTop');
