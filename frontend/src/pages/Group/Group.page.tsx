import { useSearchParams } from 'react-router-dom';

import GroupListPage from '#pages/GroupList/GroupList.page';

import GroupTypesPage from './GroupTypes.page';

export default function GroupPage() {
  const [params] = useSearchParams();

  if (params.get('type')) {
    return <GroupListPage />;
  }

  return <GroupTypesPage />;
}
