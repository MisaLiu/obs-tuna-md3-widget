import { useEffect } from 'preact/hooks';
import { M3eTheme } from '@m3e/react/theme';
import MusicWidget from './MusicWidget/MusicWidget';
import useMusicInfo from './state';
import { fetchMusicInfo } from './utils';

export function App() {
  const updateInfo = useMusicInfo((e) => e.updateInfo);

  const fetchAndUpdateInfo = () => {
    fetchMusicInfo()
      .then((info) => updateInfo(info))
      .catch(console.error);
  };

  useEffect(() => {
    const updateClock = setInterval(fetchAndUpdateInfo, 200);
    fetchAndUpdateInfo();

    return (() => {
      clearInterval(updateClock);
    })
  }, []);

  return (
    <M3eTheme>
      <MusicWidget />
    </M3eTheme>
  )
}
