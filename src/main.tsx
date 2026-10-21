import StateManager from './state.ts';
import { fetchMusicInfo, convertTimeToStr, COVER_URL_PLACEHOLDER } from './utils.ts';
import './index.css';
import ProgressBar from './progress-bar.tsx';

const DOMs = {
  thumbnail: document.querySelector<HTMLDivElement>('.card .thumbnail')!,
  info: {
    title: document.querySelector<HTMLSpanElement>('.card .info .title')!,
    artists: document.querySelector<HTMLDivElement>('.card .info .artists')!,
    album: document.querySelector<HTMLDivElement>('.card .info .album')!,
  },
  progress: {
    current: document.querySelector<HTMLDivElement>('.card .info .progress .current')!,
    total: document.querySelector<HTMLDivElement>('.card .info .progress .total')!,
  }
};

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
  if (info === null) {
    DOMs.info.title.innerText = 'Nothing playing';
    DOMs.info.artists.innerText = '';
    DOMs.info.album.innerText = '';

    return;
  }

  let artists: string = '';
  for (let i = 0; i < info.artists!.length; i++) {
    const splited = info.artists![i].split(',');

    for (let j = 0; j < splited.length; j++) {
      artists += splited[j];

      if (j < splited.length - 1 || i < info.artists!.length - 1)
        artists += ', ';
    }
  }

  const isPlaying = info.status !== 'paused' && info.status !== 'unknown';

  if (info.cover_path.startsWith('http') && USE_PLAYER_PROVIDED_THUMBNAIL_URL_FIRST) {
    DOMs.thumbnail.style.backgroundImage = `url(${info.cover_path})`;
  } else if (info.cover_url) {
    // Force updating
    const url = new URL(info.cover_url);
    url.searchParams.append('_t', `${Date.now()}`);
    DOMs.thumbnail.style.backgroundImage = `url(${url.toString()})`;
  } else {
    DOMs.thumbnail.style.backgroundImage = `url(${COVER_URL_PLACEHOLDER})`;
  }

  DOMs.info.title.innerText = info.title;
  DOMs.info.artists.innerText = artists;
  DOMs.info.album.innerText = info.album!;

  updateProgress(info.duration!, info.progress!, isPlaying);
  if (info.duration) DOMs.progress.total.innerText = convertTimeToStr(info.duration);
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
