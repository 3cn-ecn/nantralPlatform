import { Event } from '#modules/event/event.type';
import { useInfiniteItems } from '#pages/NantralPay/hooks/useInfiniteItems';

import { ItemGrid } from './ItemGrid';

export function ItemInfiniteGrid({ event }: { event: Event }) {
  const itemsQuery = useInfiniteItems({
    options: { pageSize: 6 * 5 },
  });
  return (
    <>
      <ItemGrid query={itemsQuery} event={event} />
    </>
  );
}
