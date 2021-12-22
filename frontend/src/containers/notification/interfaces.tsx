export interface Notification {
  id: number;
  body: string;
  url: string;
  icon_url: string;
  date: Date;
  high_priority: boolean;
  action1_label: string;
  action1_url: string;
  action2_label: string;
  action2_url: string;
}

export interface SentNotification {
  notification: Notification;
  subscribed: boolean;
  seen: boolean;
}
  