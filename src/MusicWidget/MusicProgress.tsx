import { M3eLinearProgressIndicator } from "@m3e/react/progress-indicator";
import useMusicInfo from "../state";
import { convertTimeToStr } from "../utils";

const MusicProgress = () => {
  const progressCurrent = useMusicInfo((e) => e.progressCurrent);
  const progressTotal = useMusicInfo((e) => e.progressTotal);

  return (
    <div class="progress">
      <div class="current-time">{convertTimeToStr(progressCurrent)}</div>
      <div class="progress-bar">
        <M3eLinearProgressIndicator
          variant="wavy"
          value={progressCurrent}
          max={progressTotal}
        />
      </div>
      <div class="total-time">{convertTimeToStr(progressTotal)}</div>
    </div>
  )
};

export default MusicProgress;
