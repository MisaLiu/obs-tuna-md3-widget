import '@preact/compat';
import { create } from 'zustand';
import { COVER_URL_PLACEHOLDER } from './utils';
import type { MusicInfo } from './types';

interface MusicInfoState {
  currentInfo: Required<MusicInfo> | null;
  coverUrl: string;
  showProgress: boolean;
  progressCurrent: number;
  progressTotal: number;

  updateInfo: (newInfo: MusicInfo) => void;
}

const useMusicInfo = create<MusicInfoState>((set) => ({
  currentInfo: null,
  coverUrl: COVER_URL_PLACEHOLDER,
  showProgress: false,
  progressCurrent: NaN,
  progressTotal: NaN,

  updateInfo: (newInfo: MusicInfo) => set((state) => {
    const result: Partial<MusicInfoState> = {};

    const updateProgressInfo = () => {
      if (isNaN(newInfo.duration!) || newInfo.duration! <= 0) return;

      result.showProgress = true;
      result.progressCurrent = newInfo.progress!;
      result.progressTotal = newInfo.duration!;

      if (result.progressCurrent >= result.progressTotal) {
        result.progressCurrent = result.progressTotal - 1;
      }
    };

    if (state.currentInfo && newInfo.track_id === state.currentInfo.track_id) {
      updateProgressInfo();
    } else if (newInfo.status_id !== 3) {
      result.currentInfo = newInfo as Required<MusicInfo>;
      updateProgressInfo();

      if (newInfo.cover_path.startsWith('http')) {
        result.coverUrl = newInfo.cover_path;
      } else if (newInfo.cover_url) {
        result.coverUrl = newInfo.cover_url;
      } else {
        result.coverUrl = COVER_URL_PLACEHOLDER;
      }
    } else {
      result.currentInfo = null;
      result.coverUrl = COVER_URL_PLACEHOLDER;
      result.showProgress = false;
      result.progressCurrent = NaN;
      result.progressTotal = NaN;
    }

    return result;
  }),
}));

export default useMusicInfo;
