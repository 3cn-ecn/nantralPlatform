import { GroupPreview } from '#modules/group/types/group.types';

export function GroupImage({
  group,
  size,
  border = false,
}: Readonly<{ group: GroupPreview; size: number; border?: boolean }>) {
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
            'object-cover rounded-full bg-gray-100' +
            (border ? ' border-2 border-white' : '')
          }
        />
      </a>
    </div>
  );
}
