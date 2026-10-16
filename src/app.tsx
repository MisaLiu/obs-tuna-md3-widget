import { useEffect, useState } from 'preact/hooks';
import { M3eTheme } from '@m3e/react/theme';
import MusicWidget from './MusicWidget/MusicWidget';
import useMusicInfo from './state';
import { getImageColorFromUrl } from './utils';

export function App() {
  const [ currentColor, setCurrentColor ] = useState('#6750A4');
  const coverUrl = useMusicInfo(e => e.coverUrl);

  useEffect(() => {
    if (!coverUrl) {
      setCurrentColor('#6750A4');
      return;
    }

    getImageColorFromUrl(coverUrl)
      .then((color) => {
        setCurrentColor(color);
      })
      .catch(console.error);
  }, [ coverUrl ]);

  return (
    <M3eTheme
      color={currentColor}
      variant='vibrant'
    >
      <MusicWidget />
    </M3eTheme>
  )
}
