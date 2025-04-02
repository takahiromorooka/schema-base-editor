import Moveable, { OnResize } from 'react-moveable';
import { useMemo } from 'react';
export const MoveableComponent = ({
  selectedBlockId,
  containerRef,
}: {
  selectedBlockId?: string;
  containerRef: React.RefObject<HTMLDivElement>;
}) => {
  const selectedTarget = useMemo(() => {
    return document.querySelector(`[data-id="${selectedBlockId}"]`);
  }, [selectedBlockId]);

  return (
    <Moveable
      target={selectedTarget as HTMLElement}
      container={containerRef.current}
      draggable={true}
      onDrag={(e) => {
        console.log('drag', e);
        e.target.style.transform = e.transform;
      }}
      resizable={true}
      onResize={({
        target, width, height,
        dist, delta, direction,
        clientX, clientY,
      }: OnResize) => {
          console.log("onResize", target);
          delta[0] && (target!.style.width = `${width}px`);
          delta[1] && (target!.style.height = `${height}px`);
      }}
      rotatable={true}
    />
  );
};
