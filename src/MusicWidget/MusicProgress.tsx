import { M3eLinearProgressIndicator } from "@m3e/react/progress-indicator";

const MusicProgress = () => {
  return (
    <div class="progress">
      <div class="current-time">1:23</div>
      <div class="progress-bar">
        <M3eLinearProgressIndicator
          variant="wavy"
          value={25}
        />
      </div>
      <div class="total-time">4:56</div>
    </div>
  )
};

export default MusicProgress;
