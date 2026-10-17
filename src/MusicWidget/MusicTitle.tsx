import { useRef, useState, useEffect } from 'preact/hooks';

interface MusicTitleProps {
  title: string;
}

const MusicTitle = ({
  title
}: MusicTitleProps) => {
  const titleWrapRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLSpanElement | null>(null);
  const [ shouldScroll, setShouldScroll ] = useState(false);

  const calculateShouldScroll = () => {
    if (!titleWrapRef.current || !titleRef.current) return;

    const parentWidth = titleWrapRef.current.clientWidth;
    const titleWidth = titleRef.current.clientWidth;

    if (parentWidth < titleWidth) {
      setShouldScroll(true);
    } else {
      setShouldScroll(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', calculateShouldScroll);
    calculateShouldScroll();

    return (() => {
      window.removeEventListener('resize', calculateShouldScroll);
    });
  }, [ title ]);

  return (
    <div
      class={[
        'title-wrapper',
        shouldScroll ? 'should-scroll' : null
      ].filter(e => !!e).join(' ')}
      ref={titleWrapRef}
    >
      <span class="title" ref={titleRef}>{title}</span>
    </div>
  );
};

export default MusicTitle;
