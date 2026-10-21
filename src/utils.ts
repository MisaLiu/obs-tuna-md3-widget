import { getColorSync } from 'colorthief';
import { SchemeVibrant, Hct, argbFromHex } from '@material/material-color-utilities';
import type { MusicInfo } from './types';

// stolen from tuna's official widget haha
export const COVER_URL_PLACEHOLDER = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAMAAADDpiTIAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAhBQTFRFUVFRUFBQUlJSU1NTVFRUVVVVVlZWV1dXWFhYWVlZWlpaW1tbXFxcXV1dXl5eX19fYGBgYWFhYmJiY2NjZGRkZWVlZmZmZ2dnaGhoaWlpampqa2trbGxsbW1tbm5ub29vcHBwcXFxcnJyc3NzdHR0dXV1dnZ2d3d3eHh4eXl5enp6e3t7fHx8fX19fn5+f39/gICAgYGBgoKCg4ODhISEhYWFhoaGh4eHiIiIiYmJioqKi4uLjIyMjY2Njo6Oj4+PkJCQkZGRkpKSk5OTlJSUlZWVlpaWl5eXmJiYmZmZmpqam5ubnJycnZ2dnp6en5+foKCgoaGhoqKio6OjpKSkpqamtLS0vLy8wsLCxsbGysrKz8/P09PT2NjY3Nzc2tra1dXV0dHRzMzMyMjIxMTEwMDAurq6q6urqKiov7+/19fX6Ojo9vb2////6urqsrKytra29PT0w8PDra2t1NTU8fHx/v7+qamp9/f3ycnJ5OTk3t7e4+Pj7+/vp6en/f393d3d/Pz88PDwpaWl8vLyxcXF7e3t+/v7rKysy8vL1tbW8/Pz39/fzs7Ou7u7wcHB7u7u5+fn5ubmqqqq6enp5eXl0tLS+fn5vb29zc3N4ODgs7Oz7Ozs4uLi9fX1sbGx0NDQ4eHhrq6u2dnZx8fH+vr6uLi4sLCwr6+vtbW1+Pj4vr6+29vbubm5t7e36+vrbKXMhAAAM9hJREFUeJztnYmbJEW19pHZN2Yfhm1QkOnu2rL2vbuW3rtnenqmBwZERVxQkQaRy7ggqygIIgKKuCGi3nvVq9+/+MU5JxIyMiurMrOnu7Jq8rzP48Piw1RmvL8850RkZJxlbmGxWCwWi8VisVgx1mc/ccsutt966a9fu3Xv27Nm7d5/Q/gMHDhwUOiR0GHRE6Ta3jrKGrh4TtD1oFrgG7gkT94Obe/cKY3fv3rVL2Ex+OwG45dZdwvq94PrBQ8Lq244eO3b8xMmTp06dPn3mzO23nz17h9Cdd955l9DdqHtYIyLyA5wRBoFPZ8/efvuZV6dpnsfvQZz8d+6Z1d+xZ48Zf16b+c89+N25v4/j5+6/99eM13w7N0/uVq80K6p0y5Vp5L1Xg/AABOAwqN6kE4AAAAJRU5Inj5";

export const fetchMusicInfo = () => (
  fetch(TUNA_URL)
    .then(e => (e.json() as unknown as MusicInfo))
);

export const getImageColorFromUrl = (url: string) => {
  return new Promise<string>((res, rej) => {
    const img = new Image();

    img.onload = async () => {
      // the `getColorSync` from M3E uses A LOT of performances
      // so we have to import colorthief for a faster color picking
      const color = getColorSync(img);
      if (!color)
        return rej('Something went wrong');

      res(color.hex());
    };

    img.onerror = (e) => rej(e);

    img.crossOrigin = "anonymous";
    img.src = url;
  });
};

export const generateMD3Colors = (color: string) => {
  const scheme = new SchemeVibrant(
    Hct.fromInt(argbFromHex(color)), true,
    0.0, '2025'
  );

  return scheme;
};

export const convertTimeToStr = (time: number) => {
  const totalSeconds = Math.floor(Math.max(0, time) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${fillNumberZero(minutes)}:${fillNumberZero(seconds)}`;
};

export const fillNumberZero = (number: number, length = 2) => (
  String(number).padStart(length, '0')
);
