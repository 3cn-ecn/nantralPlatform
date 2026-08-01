import { GroupPreview } from '#modules/group/types/group.types';

export function GroupImage({
  group,
  size,
}: Readonly<{ group: GroupPreview; size: number }>) {
  const imageUrl = group.icon || 'static/img/icons/scalable/club.svg';
  console.log(imageUrl);

  return (
    <div>
      <a href={group.url} target="_blank" rel="noopener noreferrer">
        <img
          width={size}
          height={size}
          src={imageUrl}
          alt={group.name}
          className={
            'object-cover rounded-full border-2 bg-gray-100 border-white'
          }
        />
      </a>
    </div>
  );
}
