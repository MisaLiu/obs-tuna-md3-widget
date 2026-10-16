import { M3eCard } from '@m3e/react/card';
import MusicThumbnail from './MusicThumbnail';
import MusicInfo from './MusicInfo';
import MusicProgress from './MusicProgress';
import './style.css';

const MusicWidget = () => {
  return (
    <M3eCard orientation="horizontal" class="music-widget">
      <MusicThumbnail />
      <div slot="content" class="widget-content">
        <MusicInfo />
        <MusicProgress />
      </div>
    </M3eCard>
  );
};

export default MusicWidget;
