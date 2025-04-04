import type { FC, PropsWithChildren } from 'react';
import type { BlockWithChildren, Division, Image, Paragraph } from '../schema';
import { ButtonBlock } from './blocks/ButtonBlock';
import type { BlockProps } from './blocks/type';

const ParagraphBlock: FC<BlockProps<Paragraph>> = ({ block }) => (
  <p style={block.styles} data-id={block.id}>{block.text}</p>
);

const ImageBlock: FC<BlockProps<Image>> = ({ block }) => (
  <img
    src={block.src}
    alt={block.alt || ''}
    className="max-w-full h-auto"
    style={block.styles}
    data-id={block.id}
  />
);

const DivisionBlock: FC<BlockProps<Division> & PropsWithChildren> = ({
  block,
  children,
}) => (
  <div className="p-2 border" style={block.styles} data-id={block.id}>
    {children}
  </div>
);

interface Props {
  block: BlockWithChildren;
}

export const BlockRenderer: FC<Props> = ({ block }) => {
  switch (block.type) {
    case 'button':
      return <ButtonBlock key={block.id} block={block}   />;
    case 'paragraph':
      return <ParagraphBlock key={block.id} block={block} />;
    case 'image':
      return <ImageBlock key={block.id} block={block} />;
    case 'division':
      return (
        <DivisionBlock key={block.id} block={block}>
          {block.children.map((child) => (
            <BlockRenderer key={child.id} block={child} />
          ))}
        </DivisionBlock>
      );
    default:
      return null;
  }
};
