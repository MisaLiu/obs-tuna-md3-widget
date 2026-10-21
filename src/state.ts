import type { MusicInfo } from './types';

export type StateCallback = (info: MusicInfo | null) => void;

class StateManager {
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

export default StateManager;
