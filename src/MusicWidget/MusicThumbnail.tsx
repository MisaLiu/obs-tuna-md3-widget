import useMusicInfo from '../state';

const MusicThumbnail = () => {
  const coverUrl = useMusicInfo((e) => e.coverUrl);

  return (
    <div
      slot="header"
      class="thumbnail"
      style={{
        backgroundImage: `url(${coverUrl})`,
      }}
    />
  )
};

export default MusicThumbnail;
