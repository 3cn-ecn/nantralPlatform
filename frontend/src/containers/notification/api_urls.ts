/**
 * File regrouping all urls of the api.
 */

const app = "/api/notification/";

export const registerUrl = app + "register";
export const subscriptionUrl = app + "subscription/{0}";
export const getNotificationsUrl = app + "get_notifications";
export const manageNotificationUrl = app + "notification/{0}";
