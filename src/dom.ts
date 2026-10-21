import { convertTimeToStr, COVER_URL_PLACEHOLDER } from './utils';
import type { MusicInfo } from './types';

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

export const updateInfo = (info: MusicInfo | null) => {
  if (
    info === null ||
    info.status === 'unknown'
  ) {
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
    if (info.duration) DOMs.progress.total.innerText = convertTimeToStr(info.duration);
};

export default DOMs;
