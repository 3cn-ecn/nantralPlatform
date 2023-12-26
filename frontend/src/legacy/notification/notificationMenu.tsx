import { NotificationMenu } from '#modules/notification/view/NotificationMenu/NotificationMenu';

import { wrapAndRenderLegacyCode } from '../utils/wrapAndRenderLegacyCode';

async function loadNotificationMenu() {
  wrapAndRenderLegacyCode(<NotificationMenu />, 'notificationPanel');
}

export default loadNotificationMenu;
