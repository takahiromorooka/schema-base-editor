import { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { parse } from 'valibot';
import { ArrowLeft } from 'lucide-react';
import { type Page, pageSchema, buildHierarchy } from '../schema';
import { BlockRenderer } from '../components/BlockRenderer';

export default function Preview() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const page = useMemo(() => {
    const savedData = searchParams.get('data');
    if (savedData) {
      try {
        return parse(pageSchema, JSON.parse(decodeURIComponent(savedData)));
      } catch (error) {
        console.error('Error parsing data:', error);
        return { name: 'Error loading page', blocks: {} };
      }
    }
    return { name: 'No data provided', blocks: {} };
  }, [searchParams]);

  const blockTree = useMemo(
    () => buildHierarchy(Object.values(page.blocks)),
    [page.blocks]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="grid grid-cols-[auto,1fr] items-center px-4 border-b border-gray-200 bg-white h-16 shadow-sm">
        <Link
          to={`/?data=${searchParams.get('data') || ''}`}
          className="bg-gray-100 hover:bg-gray-200 border rounded-md inline-flex py-2 px-4 items-center mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          戻る
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">{page.name}</h1>
      </header>
      
      <main className="flex-1 p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm">
          {blockTree.length > 0 ? (
            blockTree.map((block) => (
              <div key={block.id} className="mb-4">
                <BlockRenderer block={block} />
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-12">
              表示するブロックがありません。エディタに戻って追加してください。
            </p>
          )}
        </div>
      </main>
    </div>
  );
} 