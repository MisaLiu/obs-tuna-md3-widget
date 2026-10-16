if (import.meta.env.DEV) import('preact/debug');

import { render } from 'preact'
import { App } from './app.tsx'
import useMusicInfo from './state.ts';
import { fetchMusicInfo } from './utils.ts';
import './index.css';

const updateInfo = useMusicInfo.getState().updateInfo;

const fetchAndUpdateInfo = () => {
  fetchMusicInfo()
    .then((info) => {
      updateInfo(info);
      setTimeout(fetchAndUpdateInfo, 200);
    })
    .catch(console.error);
};

fetchAndUpdateInfo();

render(<App />, document.getElementById('app')!)
