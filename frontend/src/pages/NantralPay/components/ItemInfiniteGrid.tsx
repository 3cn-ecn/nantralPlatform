import { useInfiniteItems } from '#pages/NantralPay/hooks/useInfiniteItems';

import { ItemGrid } from './ItemGrid';

export function ItemInfiniteGrid() {
  const itemsQuery = useInfiniteItems({
    options: { pageSize: 6 * 5 },
  });
  return (
    <>
      <ItemGrid query={itemsQuery} />
    </>
  );
}
