import { GroupPreview } from '#modules/group/types/group.types';

import { GroupImage } from './components/GroupImage';
import { useGroupList } from './hooks/useGroupList';

export default function HomePage() {
  const groups = useGroupList();
  console.log('groups', groups);
  const myGroupsIconSize = 72; // Adjust the size as needed

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="m-4">
        <h2 className="text-xl font-bold text-gray-800">Mes groupes</h2>
        <div className="bg-gray-100 flex flex-row">
          {groups?.map((group: GroupPreview) => (
            <div key={group.id} className="items-center mt-4 ml-2">
              <GroupImage group={group} size={myGroupsIconSize} />
              <p
                style={{ maxWidth: `${myGroupsIconSize * 1.2}px` }}
                className={
                  'text-center text-small text-secondary mt-2 line-clamp-1 break-all'
                }
              >
                {group.shortName || group.name}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center ">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to the Home Page
        </h1>
        <p className="text-lg text-gray-600">
          This is a simple home page built with React and Tailwind CSS.
        </p>
      </div>
    </div>
  );
}
