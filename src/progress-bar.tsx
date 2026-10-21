import { interpolate, formatHex } from 'culori';

const WAVE_LENGTH = 40;
const WAVE_AMPLITUDE = 3;
const BAR_TRANSITION = 200;

const WAVE_FREQUENCY = 2 * Math.PI / WAVE_LENGTH;
const WAVE_STEP = Math.min(2, WAVE_LENGTH / 12);

const CIRCLE_ARC = Math.PI * 2;

const clamp = (value: number, min: number, max: number) => (
  Math.min(Math.max(value, min), max)
);

const calcWaveY = (px: number, phase: number, multiplier = 1) => (
  5 /* centerY */ +
  (WAVE_AMPLITUDE * multiplier) * Math.sin((px - phase) * WAVE_FREQUENCY)
);

export class ProgressBar {
  readonly canvas: HTMLCanvasElement;
  private readonly canvasContext: CanvasRenderingContext2D;

  private width: number = 100;

  min: number = 0;
  max: number = 100;
  value: number = 0;

  private _wavy = false;
  private _wavyOld = false;

  private wavyUpdatedAt: number | null = null;

  private _barColorPrimary: string = '#cdc0ec';
  private _barColorSecondary: string = '#3e384c';

  private _barColorPrimaryOld: string = '#cdc0ec';
  private _barColorSecondaryOld: string = '#3e384c';

  private barColorUpdatedAt: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    const ctx = canvas.getContext('2d', { antialias: true }) as CanvasRenderingContext2D | null;
    if (!ctx)
      throw new Error('Failed to create Canvas2D context');

    this.canvasContext = ctx;

    window.addEventListener('resize', () => this.resize(canvas.parentElement?.clientWidth ?? 100, window.devicePixelRatio));
    document.addEventListener('DOMContentLoaded', () => this.resize(canvas.parentElement?.clientWidth ?? 100, window.devicePixelRatio), { once: true });

    this.draw = this.draw.bind(this);
    requestAnimationFrame(this.draw);
  }

  resize(width: number, resolution = window.devicePixelRatio) {
    this.canvas.width = Math.max(width, 40) * resolution;
    this.canvas.height = 10 * resolution;

    this.canvas.style.width = `${Math.max(width, 40)}px`;
    this.canvas.style.height = '10px';

    this.width = Math.max(width, 40);
    this.canvasContext.scale(resolution, resolution);
  }

  draw() {
    requestAnimationFrame(this.draw);

    const ctx = this.canvasContext;
    const width = this.width - 4;

    const currentTime = performance.now();
    const phase = ((currentTime / 1000) * -25) % WAVE_LENGTH;
    const progressPercent = clamp(this.value / (this.max - this.min), 0, 1);
    const progressEnd = width * progressPercent;
    const emptyStart = progressEnd + 8;
    const barEnd = width + 2;

    let primaryColor = this._barColorPrimaryOld;
    let secondaryColor = this._barColorSecondaryOld;

    if (this.barColorUpdatedAt !== null) {
      const timeBetween = currentTime - this.barColorUpdatedAt;
      if (timeBetween >= BAR_TRANSITION) {
        this._barColorPrimaryOld = this._barColorPrimary;
        this._barColorSecondaryOld = this._barColorSecondary;

        primaryColor = this._barColorPrimary;
        secondaryColor = this._barColorSecondary;

        this.barColorUpdatedAt = null;
      } else {
        const primaryInterpolate = interpolate(
          [ this._barColorPrimaryOld, this._barColorPrimary ],
          'oklab'
        );
        const secondaryInterpolate = interpolate(
          [ this._barColorSecondaryOld, this._barColorSecondary ],
          'oklab'
        );

        const timePercent = clamp(timeBetween / BAR_TRANSITION, 0, 1);
        primaryColor = formatHex(primaryInterpolate(timePercent));
        secondaryColor = formatHex(secondaryInterpolate(timePercent));
      }
    }

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    if (barEnd - emptyStart > 2) {
      ctx.strokeStyle = secondaryColor;

      ctx.beginPath();
      if (progressEnd > 0) {
        ctx.moveTo(progressEnd + 8, 5);
      } else {
        ctx.moveTo(2, 5);
      }

      ctx.lineTo(width + 2, 5);
      ctx.stroke();
    }
    
    if (barEnd - emptyStart > -4) {
      ctx.fillStyle = primaryColor;

      ctx.beginPath();
      ctx.arc(width + 2, 5, 2, 0, CIRCLE_ARC);
      ctx.fill();
    }

    if (progressEnd > 0) {
      let wavyMultiplier = this._wavyOld ? 1 : 0;

      if (this.wavyUpdatedAt !== null) {
        const timeBetween = currentTime - this.wavyUpdatedAt;
        if (timeBetween >= BAR_TRANSITION) {
          this._wavyOld = this._wavy;
          wavyMultiplier = this._wavyOld ? 1 : 0;
          this.wavyUpdatedAt = null;
        } else {
          const timePercent = clamp(timeBetween / BAR_TRANSITION, 0, 1);
          if (!this._wavyOld) {
            wavyMultiplier = timePercent
          } else {
            wavyMultiplier = 1 - timePercent;
          }
        }
      }

      ctx.strokeStyle = primaryColor;

      ctx.beginPath();
      if (wavyMultiplier > 0) {
        ctx.moveTo(2, calcWaveY(2, phase, wavyMultiplier));

        for (let px = 2; px < progressEnd + 2; px += WAVE_STEP) {
          ctx.lineTo(px, calcWaveY(px, phase, wavyMultiplier));
        }
        ctx.lineTo(progressEnd + 2, calcWaveY(progressEnd + 2, phase, wavyMultiplier));
      } else {
        ctx.moveTo(2, 5);
        ctx.lineTo(progressEnd + 2, 5);
      }

      ctx.stroke();
    }
  }

  get wavy() {
    return this._wavy;
  }

  set wavy(boolean: boolean) {
    if (boolean === this._wavy) return;

    this._wavy = boolean;
    this.wavyUpdatedAt = performance.now();
  }

  get barColorPrimary() {
    return this._barColorPrimary;
  }

  set barColorPrimary(color: string) {
    if (this._barColorPrimary === color) return;

    this._barColorPrimary = color;
    this.barColorUpdatedAt = performance.now();
  }

  get barColorSecondary() {
    return this._barColorSecondary;
  }

  set barColorSecondary(color: string) {
    if (this._barColorSecondary === color) return;

    this._barColorSecondary = color;
    this.barColorUpdatedAt = performance.now();
  }
}

const progress = new ProgressBar(document.querySelector('canvas#progress-bar')!);
export default progress;
