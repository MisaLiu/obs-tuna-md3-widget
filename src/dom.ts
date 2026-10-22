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

export const checkShouldScroll = () => {
  const titleWrapper = document.querySelector<HTMLDivElement>('.card .info .title-wrapper')!;

  const parentWidth = titleWrapper.clientWidth;
  const titleWidth = DOMs.info.title.clientWidth;

  if (parentWidth < titleWidth) {
    titleWrapper.classList.add('should-scroll')
  } else {
    titleWrapper.classList.remove('should-scroll')
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

    return COVER_URL_PLACEHOLDER;
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

  let thumbnailUrl = COVER_URL_PLACEHOLDER;
  if (info.cover_path.startsWith('http') && USE_PLAYER_PROVIDED_THUMBNAIL_URL_FIRST) {
    thumbnailUrl = info.cover_path;
  } else if (info.cover_url) {
    // Force updating
    const url = new URL(info.cover_url);
    url.searchParams.append('_t', `${Date.now()}`);
    thumbnailUrl = url.toString();
  }

  DOMs.thumbnail.style.backgroundImage = `url(${thumbnailUrl})`;
  DOMs.info.title.innerText = info.title;
  DOMs.info.artists.innerText = artists;
  DOMs.info.album.innerText = info.album!;
  if (info.duration) DOMs.progress.total.innerText = convertTimeToStr(info.duration);

  checkShouldScroll();
  
  return thumbnailUrl;
};

window.addEventListener('resize', () => checkShouldScroll());

export default DOMs;
