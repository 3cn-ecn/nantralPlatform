import { Grid, Typography } from '@mui/material';
import { UseInfiniteQueryResult } from '@tanstack/react-query';

import { ItemPreview } from '#modules/nantralpay/types/item.type';
import ItemCard from '#modules/nantralpay/view/shared/ItemCard';
import { ItemCardSkeleton } from '#modules/nantralpay/view/shared/ItemCardSkeleton';
import { InfiniteList } from '#shared/components/InfiniteList/InfiniteList';
import { useTranslation } from '#shared/i18n/useTranslation';
import { Page } from '#shared/infra/pagination';

export function ItemGrid({
  query,
}: {
  query: UseInfiniteQueryResult<Page<ItemPreview>>;
}) {
  const { t } = useTranslation();
  return (
    <InfiniteList query={query}>
      <Grid spacing={1} container my={2}>
        {query.data?.pages
          .flatMap((page) => page.results)
          .map((item) => <ItemCard key={item.id} item={item} />)}
        {query.data?.pages[0].count === 0 && (
          <Typography px={2}>
            {t('group.details.modal.editGroup.noMembers')}
          </Typography>
        )}
        {(query.isLoading || query.isFetchingNextPage) &&
          Array(6)
            .fill(0)
            // eslint-disable-next-line react/no-array-index-key
            .map((_, i) => <ItemCardSkeleton key={i} />)}
      </Grid>
    </InfiniteList>
  );
}
