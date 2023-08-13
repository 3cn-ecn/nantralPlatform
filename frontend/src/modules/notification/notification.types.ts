export type SentNotification = {
  id: number;
  title: string;
  body: string;
  url: string;
  iconUrl: string;
  date: Date;
  seen: boolean;
  subscribed: boolean;
};
