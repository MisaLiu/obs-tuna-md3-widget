import { M3eCard } from '@m3e/react/card';
import MusicThumbnail from './MusicThumbnail';
import MusicInfo from './MusicInfo';
import MusicProgress from './MusicProgress';
import useMusicInfo from '../state';
import './style.css';

const MusicWidget = () => {
  const showProgress = useMusicInfo((e) => e.showProgress);

  return (
    <M3eCard
      orientation="horizontal"
      class={[
        'music-widget',
        !showProgress ? 'no-progress' : null
      ].filter(e => !!e).join(' ')}
    >
      <MusicThumbnail />
      <div slot="content" class="widget-content">
        <MusicInfo />
        {showProgress && <MusicProgress />}
      </div>
    </M3eCard>
  );
};

export default MusicWidget;
