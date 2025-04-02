import type { Button } from '@/schema';
import { type FC, useCallback, useEffect, useRef } from 'react';
import type { BlockProps } from './type';

export const ButtonBlock: FC<BlockProps<Button>> = ({ block }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframeWindow = iframeRef.current?.contentWindow;

    if (iframeWindow) {
      iframeWindow.postMessage(
        { type: 'LOAD_SCRIPT', script: block.onClick },
        '*',
      );
    }
  }, [iframeRef.current, block.onClick]);

  const handleClick = useCallback(() => {
    const iframeWindow = iframeRef.current?.contentWindow;
    if (iframeWindow) {
      iframeWindow.postMessage({ type: 'EXECUTE_SCRIPT' }, '*');
    }
  }, []);

  return (
    <div>
      <button
        type="button"
        style={block.styles}
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleClick}
      >
        {block.text}
      </button>
      {/* サンドボックス用のiframe */}
      <iframe
        ref={iframeRef}
        sandbox="allow-scripts allow-modals"
        style={{ display: 'none' }}
        title="sandbox"
        srcDoc={`
          <script>
            let script = '';
            window.addEventListener('message', (event) => {
              if (event.data.type === 'LOAD_SCRIPT') {
                script = event.data.script;
              } else if (event.data.type === 'EXECUTE_SCRIPT') {
                try {
                  const func = new Function(script)
                  func();
                } catch (error) {
                  console.error('Script execution error:', error);
                }
              }
            });
          </script>
        `}
      ></iframe>
    </div>
  );
};
