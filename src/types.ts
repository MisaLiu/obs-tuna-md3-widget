
export interface MusicInfo {
  status: string;
  status_id: number;
  playback_date: string;
  playback_time: string;
  title: string;
  cover_path: string;
  cover_url: string;
  lyrics: string;

  artists?: string[];
  album?: string;
  disc_number?: number;
  track_id?: string;
  track_number?: number;
  progress?: number;
  duration?: number;
}
