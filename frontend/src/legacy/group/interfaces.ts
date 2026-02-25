export interface Membership {
  id: number;
  user: {
    id: number;
    name: string;
    url: string;
    picture: string;
  };
  group: {
    name: string;
    slug: string;
    url: string;
    icon: string;
  };
  summary: string;
  description: string;
  begin_date?: string; // date as ISO string
  end_date?: string; // date as ISO string
  priority: number;
  admin: boolean;
  admin_request?: boolean;
  dragId: string;
}

export interface Page<T> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}
