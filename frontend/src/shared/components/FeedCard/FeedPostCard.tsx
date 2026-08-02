import { PostPreview } from '#modules/post/post.types';

import { Card } from '../Card';
import { GroupImage } from '../GroupImage/GroupImage';

interface FeedCardProps {
  content: PostPreview;
}

export function FeedPostCard({ content }: Readonly<FeedCardProps>) {
  const authorName = content.group.name;
  const creationDate = content.createdAt;
  const updateDate = content.updatedAt;

  return (
    <Card className="max-w-3xl mx-auto p-3">
      {/* Card header with author information */}
      <div className="px-4 pt-4 flex flex-row items-center gap-4">
        <GroupImage group={content.group} size={48} />
        <div className="flex flex-col">
          <p className="text-md font-medium text-gray-800">{authorName}</p>
          <p className="text-xs font-normal text-gray-400">
            {creationDate &&
            updateDate &&
            creationDate.getTime() !== updateDate.getTime()
              ? `${creationDate.toLocaleString()} (modifié le ${updateDate.toLocaleDateString()})`
              : `${creationDate?.toLocaleString()}`}
          </p>
        </div>
      </div>
      {/* Card content */}
      <div className="mt-2 px-4 pb-4">
        <h3 className="text-lg font-medium text-gray-800">{content.title}</h3>
        <p className="text-sm font-normal text-gray-500">
          {content.description}
        </p>
        <div className="mt-8">
          {content.image && (
            <img
              src={content.image}
              alt={content.title}
              className="rounded-lg"
            />
          )}
        </div>
      </div>
    </Card>
  );
}
