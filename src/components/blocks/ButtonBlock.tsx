import type { Button } from '@/schema';
import { type FC, useCallback } from 'react';
import type { BlockProps } from './type';

export const ButtonBlock: FC<BlockProps<Button>> = ({ block }) => {

  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);

  return (
    <div>
      <button
        type="button"
        data-id={block.id}
        style={block.styles}
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleClick}
      >
        {block.text}
      </button>
    </div>
  );
};
