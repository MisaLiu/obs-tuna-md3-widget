import '@preact/compat';
import { create } from 'zustand';
import { COVER_URL_PLACEHOLDER } from './utils';
import type { MusicInfo } from './types';

let currentTimeLastVal = 0;
let currentTimeUpdated = performance.now();

interface MusicInfoState {
  currentInfo: Required<MusicInfo> | null;
  coverUrl: string;
  status: string | null;
  showProgress: boolean;
  progressCurrent: number;
  progressTotal: number;

  updateInfo: (newInfo: MusicInfo) => void;
}

const useMusicInfo = create<MusicInfoState>((set) => ({
  currentInfo: null,
  coverUrl: COVER_URL_PLACEHOLDER,
  status: null,
  showProgress: false,
  progressCurrent: NaN,
  progressTotal: NaN,

  updateInfo: (newInfo: MusicInfo) => set((state) => {
    const result: Partial<MusicInfoState> = {};

    const updateProgressInfo = (forceToZero = false) => {
      if (isNaN(newInfo.duration!) || newInfo.duration! <= 0) return;

      result.showProgress = true;
      result.progressTotal = newInfo.duration!;

      // NOTE: These all roughly "playback timer offset" stuff
      // will be replaced by a more precise version later
      if (newInfo.status !== 'playing') {
        currentTimeLastVal = newInfo.progress!;
        currentTimeUpdated = performance.now();
        result.progressCurrent = 0;
      } if (forceToZero) {
        currentTimeLastVal = 0;
        currentTimeUpdated = performance.now();
        result.progressCurrent = 0;
      } else if (currentTimeLastVal !== newInfo.progress!) {
        currentTimeLastVal = newInfo.progress!;
        currentTimeUpdated = performance.now();
        result.progressCurrent = newInfo.progress!;
      } else {
        result.progressCurrent = currentTimeLastVal + (performance.now() - currentTimeUpdated);
      }

      if (result.progressCurrent >= result.progressTotal) {
        result.progressCurrent = result.progressTotal - 1;
      }
    };

    if (state.currentInfo && newInfo.track_id === state.currentInfo.track_id) {
      updateProgressInfo();
      result.status = newInfo.status;
    } else if (newInfo.status_id !== 3) {
      result.currentInfo = newInfo as Required<MusicInfo>;
      updateProgressInfo(true);
      result.status = newInfo.status;

      if (newInfo.cover_path.startsWith('http') && USE_PLAYER_PROVIDED_THUMBNAIL_URL_FIRST) {
        result.coverUrl = newInfo.cover_path;
      } else if (newInfo.cover_url) {
        // Force updating
        const url = new URL(newInfo.cover_url);
        url.searchParams.append('_t', `${Date.now()}`);
        result.coverUrl = url.toString();
      } else {
        result.coverUrl = COVER_URL_PLACEHOLDER;
      }
    } else {
      result.currentInfo = null;
      result.coverUrl = COVER_URL_PLACEHOLDER;
      result.status = null;
      result.showProgress = false;
      result.progressCurrent = NaN;
      result.progressTotal = NaN;
    }

    return result;
  }),
}));

export default useMusicInfo;

export type StateCallback = (info: MusicInfo | null) => void;

export class StateManager {
  private callbackState: StateCallback[] = [];
  private callbackProgress: StateCallback[] = [];

  state: MusicInfo | null = null;

  private stateKey: string | null = null;

  on(type: 'state' | 'progress', callback: StateCallback) {
    if (type === 'state') {
      this.callbackState = [
        ...this.callbackState,
        callback
      ];
    } else {
      this.callbackProgress = [
        ...this.callbackProgress,
        callback
      ];
    }
  }

  update(newInfo: MusicInfo) {
    const oldState = this.state;
    this.state = newInfo;

    const newStateKey = this.buildStateKey(newInfo);
    if (this.stateKey !== newStateKey) {
      this.stateKey = newStateKey;
      this.dispatch('state');
    } else if (
      oldState &&
      (
        oldState.status_id !== newInfo.status_id ||
        oldState.progress !== newInfo.progress
      )
    ) {
      this.dispatch('progress');
    }
  }

  private dispatch(type: 'state' | 'progress') {
    if (type === 'state') {
      for (const callback of this.callbackState) {
        callback.call(this, this.state);
      }
    } else {
      for (const callback of this.callbackProgress) {
        callback.call(this, this.state);
      }
    }
  }

  private buildStateKey(info: MusicInfo) {
    if (
      info.status_id === 3 ||
      !info.track_id
    ) return null;

    return `${info.title}-${info.artists!.join(',')}-${info.album!}`;
  }
}
