export interface SentNotificationDTO {
  notification: {
    id: number;
    title: string;
    body: string;
    url: string;
    icon_url: string;
    date: string;
  };
  seen: boolean;
  subscribed: boolean;
}
