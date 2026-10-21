import { interpolate, formatHex } from 'culori';

const WAVE_LENGTH = 40;
const WAVE_AMPLITUDE = 3;
const COLOR_TRANSITION = 200;

const WAVE_FREQUENCY = 2 * Math.PI / WAVE_LENGTH;
const WAVE_STEP = Math.min(2, WAVE_LENGTH / 12);

const CIRCLE_ARC = Math.PI * 2;

const clamp = (value: number, min: number, max: number) => (
  Math.min(Math.max(value, min), max)
);

const calcWaveY = (px: number, phase: number) => (
  5 /* centerY */ +
  WAVE_AMPLITUDE * Math.sin((px - phase) * WAVE_FREQUENCY)
);

class ProgressBar {
  readonly canvas: HTMLCanvasElement;
  private readonly canvasContext: CanvasRenderingContext2D;

  private width: number = 100;

  min: number = 0;
  max: number = 100;
  value: number = 25;

  private _barColorPrimary: string = '#6750A4';
  private _barColorSecondary: string = '#E8DEF8';

  private _barColorPrimaryOld: string = '#6750A4';
  private _barColorSecondaryOld: string = '#E8DEF8';

  private barColorUpdatedAt: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    const ctx = canvas.getContext('2d', { antialias: true }) as CanvasRenderingContext2D | null;
    if (!ctx)
      throw new Error('Failed to create Canvas2D context');

    this.canvasContext = ctx;

    this.resize(canvas.parentElement?.clientWidth ?? 100);
    window.addEventListener('resize', () => { this.resize(canvas.parentElement?.clientWidth ?? 100, window.devicePixelRatio) });

    this.draw = this.draw.bind(this);
    requestAnimationFrame(this.draw);
  }

  resize(width: number, resolution = window.devicePixelRatio) {
    this.canvas.width = Math.max(width, 40) * resolution;
    this.canvas.height = 10 * resolution;

    this.canvas.style.width = `${Math.max(width, 40)}px`;
    this.canvas.style.height = '10px';

    this.width = width;
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
      if (timeBetween >= COLOR_TRANSITION) {
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

        const timePercent = clamp(timeBetween / COLOR_TRANSITION, 0, 1);
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
      ctx.strokeStyle = primaryColor;

      ctx.beginPath();
      ctx.moveTo(2, calcWaveY(2, phase));

      for (let px = 2; px < progressEnd + 2; px += WAVE_STEP) {
        ctx.lineTo(px, calcWaveY(px, phase));
      }

      ctx.lineTo(progressEnd + 2, calcWaveY(progressEnd + 2, phase));
      ctx.stroke();
    }
  }

  get barColorPrimary() {
    return this._barColorPrimary;
  }

  set barColorPrimary(color: string) {
    this._barColorPrimary = color;
    this.barColorUpdatedAt = performance.now();
  }

  get barColorSecondary() {
    return this._barColorSecondary;
  }

  set barColorSecondary(color: string) {
    this._barColorSecondary = color;
    this.barColorUpdatedAt = performance.now();
  }
}

export default ProgressBar;
