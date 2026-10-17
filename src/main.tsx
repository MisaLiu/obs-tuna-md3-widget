if (import.meta.env.DEV) import('preact/debug');

import { render } from 'preact'
import { App } from './app.tsx'
import useMusicInfo from './state.ts';
import { fetchMusicInfo } from './utils.ts';
import './index.css';

const updateInfo = useMusicInfo.getState().updateInfo;

const fetchAndUpdateInfo = () => {
  fetchMusicInfo()
    .then((info) => updateInfo(info))
    .catch(console.error)
    .finally(() => {
      setTimeout(fetchAndUpdateInfo, 200);
    });
};

fetchAndUpdateInfo();

render(<App />, document.getElementById('app')!)
