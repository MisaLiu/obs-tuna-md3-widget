import MusicTitle from './MusicTitle';
import useMusicInfo from '../state';

const MusicInfo = () => {
  const musicInfo = useMusicInfo((e) => e.currentInfo);

  let artists: string = '';
  if (musicInfo) {
    for (let i = 0; i < musicInfo.artists.length; i++) {
      const splited = musicInfo.artists[i].split(',');

      for (let j = 0; j < splited.length; j++) {
        artists += splited[j];

        if (j < splited.length - 1 || i < musicInfo.artists.length - 1)
          artists += ', ';
      }
    }
  }

  return (
    <div class="info">
      <MusicTitle title={musicInfo ? musicInfo.title : 'Nothing playing'} />
      {
        musicInfo && (
          <>
            <div class="artist">{artists}</div>
            <div class="album">{musicInfo.album}</div>
          </>
        )
      }
    </div>
  )
};

export default MusicInfo;
