import { BoxSelect, Eye, Image, Plus, Type } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { parse, safeParse } from 'valibot';
import { BlockForm } from '../components/BlockForm';
import { BlockRenderer } from '../components/BlockRenderer';
import {
  type Block,
  type BlockType,
  type Page,
  blockSchema,
  buildHierarchy,
  newBlock,
  pageSchema,
  parentableBlockSchema,
} from '../schema';

type BlockTreeItem = Block & { children?: BlockTreeItem[] };

export default function Editor() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [selectedBlockId, setSelectedBlockId] = useState<string | undefined>(
    undefined,
  );
  const [page, setPage] = useState<Page>(() => {
    const savedData = searchParams.get('data');
    if (savedData) {
      return parse(pageSchema, JSON.parse(decodeURIComponent(savedData)));
    }
    return { name: 'New Page', blocks: {} };
  });
  console.log(page);
  const queryData = useMemo(
    () => encodeURIComponent(JSON.stringify(page)),
    [page],
  );
  const blockTree = useMemo(
    () => buildHierarchy(Object.values(page.blocks)),
    [page.blocks],
  );

  useEffect(() => {
    window.history.replaceState({}, '', `?data=${queryData}`);
  }, [queryData]);

  const addBlock = (type: BlockType, parentId?: string) => {
    let validParentId = undefined;
    if (parentId) {
      const parentBlock = page.blocks[parentId];
      const isParentable = safeParse(
        parentableBlockSchema,
        parentBlock,
      ).success;
      if (isParentable) {
        validParentId = parentId;
      }
    }

    const id = nanoid();
    setPage((prevPage) => ({
      ...prevPage,
      blocks: {
        ...prevPage.blocks,
        [id]: newBlock(type, id, validParentId),
      },
    }));
    setSelectedBlockId(id);
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    setPage((prevPage) => ({
      ...prevPage,
      blocks: {
        ...prevPage.blocks,
        [id]: parse(blockSchema, { ...prevPage.blocks[id], ...updates }),
      },
    }));
  };

  const deleteBlock = (id: string) => {
    setPage((prevPage) => {
      const { [id]: _, ...remainingBlocks } = prevPage.blocks;
      return { ...prevPage, blocks: remainingBlocks };
    });
    setSelectedBlockId(undefined);
  };

  const renderBlockTree = (blocks: BlockTreeItem[], depth = 0) => {
    return (
      <ul className={depth > 0 ? 'ml-4' : ''}>
        {blocks.map((block) => (
          <li key={block.id} className="my-1">
            <button
              type="button"
              onClick={() => setSelectedBlockId(block.id)}
              className={`w-full text-left px-2 py-1 rounded ${
                selectedBlockId === block.id
                  ? 'bg-gray-600 text-white'
                  : 'hover:bg-gray-700'
              }`}
            >
              {block.type} - {block.id.slice(0, 6)}
            </button>
            {block.children && renderBlockTree(block.children, depth + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="grid grid-rows-[auto,1fr] h-screen text-sm">
      <header className="grid grid-cols-[1fr,auto] items-center px-4 border-b border-gray-700 bg-gray-800 h-16">
        <h1 className="text-2xl font-bold">No-Code UI Builder</h1>
        <Link
          to={`/preview?data=${queryData}`}
          className="bg-gray-700 hover:bg-gray-600 border rounded-md inline-flex py-2 px-4 items-center"
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Link>
      </header>
      <div className="grid grid-cols-[1fr,4fr,1fr] overflow-hidden">
        <aside className="border-r border-gray-700 p-4 overflow-y-auto">
          <nav>
            <h2 className="text-lg font-semibold mb-2">Add Blocks</h2>
            <ul className="space-y-2 mb-6">
              {(
                [
                  ['button', Plus],
                  ['paragraph', Type],
                  ['image', Image],
                  ['division', BoxSelect],
                ] as const
              ).map(([type, Icon]) => (
                <li key={type}>
                  <button
                    type="button"
                    onClick={() => addBlock(type, selectedBlockId)}
                    className="w-full px-4 py-2 text-white rounded bg-gray-700 hover:bg-gray-600 flex items-center"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    Add {type}
                  </button>
                </li>
              ))}
            </ul>
            <h2 className="text-lg font-semibold mb-2">Block Tree</h2>
            {renderBlockTree(blockTree)}
          </nav>
        </aside>

        <main className="p-4 overflow-y-auto">
          <article className="bg-white p-4 min-h-full text-black flex flex-col gap-2">
            {blockTree.map((block) => (
              <div key={block.id} className="w-full">
                <BlockRenderer block={block} />
              </div>
            ))}
          </article>
        </main>

        <aside className="border-l border-gray-700 p-4 overflow-y-auto">
          {selectedBlockId && (
            <BlockForm
              block={page.blocks[selectedBlockId]}
              onUpdate={(updates) => updateBlock(selectedBlockId, updates)}
              onDelete={() => deleteBlock(selectedBlockId)}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
