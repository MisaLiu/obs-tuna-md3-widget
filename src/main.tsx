import StateManager from './state.ts';
import DOMs, { updateInfo } from './dom';
import { fetchMusicInfo, convertTimeToStr } from './utils.ts';
import ProgressBar from './progress-bar.tsx';
import './index.css';

const progress = new ProgressBar(document.querySelector('canvas#canvas')!);
const state = new StateManager();

const updateProgress = (max: number, current: number, isPlaying: boolean) => {
  if (isNaN(max) || max <= 0) return;

  DOMs.progress.current.innerText = convertTimeToStr(current);

  progress.max = max;
  progress.value = current;
  progress.wavy = isPlaying;
};

state.on('state', (info) => {
  updateInfo(info);

  if (info === null) return;

  const isPlaying = info.status !== 'paused' && info.status !== 'unknown';
  updateProgress(info.duration!, info.progress!, isPlaying);
});

state.on('progress', (info) => {
  if (info === null) return;
  const isPlaying = info.status !== 'paused' && info.status !== 'unknown';
  updateProgress(info.duration!, info.progress!, isPlaying);
});

const fetchAndUpdateInfo = () => {
  fetchMusicInfo()
    .then((info) => state.update(info))
    .catch(console.error)
    .finally(() => {
      setTimeout(fetchAndUpdateInfo, 200);
    });
};

fetchAndUpdateInfo();
