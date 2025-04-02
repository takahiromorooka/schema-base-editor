import {
  type InferOutput,
  object,
  string,
  optional,
  literal,
  union,
  intersect,
  record,
} from "valibot";

const stylesSchema = object({
  color: optional(string()),
  backgroundColor: optional(string()),
  fontSize: optional(string()),
});

// ブロックの共通情報を持つスキーマ
const baseBlockSchema = object({
  id: string(),
  parentId: optional(string()),
  styles: stylesSchema,
});

const buttonBlockSchema = intersect([
  baseBlockSchema,
  object({
    type: literal("button"),
    text: string(),
    onClick: optional(string()),
  }),
]);

const paragraphBlockSchema = intersect([
  baseBlockSchema,
  object({
    type: literal("paragraph"),
    text: string(),
  }),
]);

const imageBlockSchema = intersect([
  baseBlockSchema,
  object({
    type: literal("image"),
    src: string(),
    alt: optional(string()),
  }),
]);

const divisionBlockSchema = intersect([
  baseBlockSchema,
  object({
    type: literal("division"),
  }),
]);

// 全ブロックタイプのユニオン
export const blockSchema = union([
  buttonBlockSchema,
  paragraphBlockSchema,
  imageBlockSchema,
  divisionBlockSchema,
]);

// ページレイアウトのスキーマ
export const pageSchema = object({
  name: string(),
  blocks: record(string(), blockSchema), // IDによる全ブロックのマップ
});

// Valibotスキーマから型を推論
export type Page = InferOutput<typeof pageSchema>;
export type Block = InferOutput<typeof blockSchema>;
export type BlockType = Block["type"];
export type Button = InferOutput<typeof buttonBlockSchema>;
export type Paragraph = InferOutput<typeof paragraphBlockSchema>;
export type Image = InferOutput<typeof imageBlockSchema>;
export type Division = InferOutput<typeof divisionBlockSchema>;

const newButton = (id: string, parentId?: string): Button => ({
  id,
  parentId,
  type: "button",
  text: "Click me",
  styles: {},
});

const newParagraph = (id: string, parentId?: string): Paragraph => ({
  id,
  parentId,
  type: "paragraph",
  text: "Paragraph text",
  styles: {},
});

const newImage = (id: string, parentId?: string): Image => ({
  id,
  parentId,
  type: "image",
  src: "https://via.placeholder.com/150",
  alt: "",
  styles: {},
});

const newDivision = (id: string, parentId?: string): Division => ({
  id,
  parentId,
  type: "division",
  styles: {},
});

export const newBlock = (
  type: BlockType,
  id: string,
  parentId?: string
): Block => {
  switch (type) {
    case "button":
      return newButton(id, parentId);
    case "paragraph":
      return newParagraph(id, parentId);
    case "image":
      return newImage(id, parentId);
    case "division":
      return newDivision(id, parentId);
  }
};

// 親になれるブロックは DivisionBlock のみ
export const parentableBlockSchema = union([divisionBlockSchema]);

export type BlockWithChildren = Block & {
  children: BlockWithChildren[];
};

export const buildHierarchy = (blocks: Block[]): BlockWithChildren[] => {
  const map = new Map<string, BlockWithChildren>();

  // 各ブロックをchildrenプロパティ付きで初期化
  for (const block of blocks) {
    map.set(block.id, { ...block, children: [] });
  }

  const result: BlockWithChildren[] = [];

  // 親子構造を構築
  for (const block of blocks) {
    const parentBlock = map.get(block.parentId ?? "");
    const childBlock = map.get(block.id);

    if (parentBlock && childBlock) {
      parentBlock.children.push(childBlock);
    } else if (childBlock) {
      result.push(childBlock);
    }
  }

  return result;
}; 