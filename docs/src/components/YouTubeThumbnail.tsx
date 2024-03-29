type YouTubeThumbnailProps = {
  url: string;
  alt: string;
  style?: React.CSSProperties;
};

export default function YouTubeThumbnail({
  url,
  alt,
  style,
}: YouTubeThumbnailProps) {
  const id = url.match(/[\w-]{11}/g)[0];
  const thumbnailUrl = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        width: '49%',
        maxWidth: '100%',
        ...style,
      }}
    >
      <span>{alt}</span>
      <img
        src={thumbnailUrl}
        alt={alt}
        title={alt}
        style={{
          width: '100%',
          aspectRatio: '16 / 9',
          objectFit: 'cover',
        }}
      />
    </a>
  );
}
