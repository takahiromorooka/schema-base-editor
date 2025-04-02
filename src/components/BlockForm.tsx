import { FC } from "react";
import { Block, Button, Paragraph, Image } from "../schema";

interface Props {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
}

export const BlockForm: FC<Props> = ({ block, onUpdate, onDelete }) => {
  const handleCommonStyleChange = (
    property: keyof Block["styles"],
    value: string
  ) => {
    onUpdate({
      styles: {
        ...block.styles,
        [property]: value,
      },
    });
  };

  const renderSpecificFields = () => {
    switch (block.type) {
      case "button":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium">Button Text</label>
              <input
                type="text"
                value={(block as Button).text}
                onChange={(e) => onUpdate({ text: e.target.value })}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">onClick Script</label>
              <textarea
                value={(block as Button).onClick || ""}
                onChange={(e) => onUpdate({ onClick: e.target.value })}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded h-24 font-mono text-sm"
                placeholder="JavaScript code to run when clicked"
              />
            </div>
          </>
        );

      case "paragraph":
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium">Paragraph Text</label>
            <textarea
              value={(block as Paragraph).text}
              onChange={(e) => onUpdate({ text: e.target.value })}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded h-24"
            />
          </div>
        );

      case "image":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium">Image URL</label>
              <input
                type="text"
                value={(block as Image).src}
                onChange={(e) => onUpdate({ src: e.target.value })}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Alt Text</label>
              <input
                type="text"
                value={(block as Image).alt || ""}
                onChange={(e) => onUpdate({ alt: e.target.value })}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Edit {block.type}</h3>

      <div className="space-y-4">
        {renderSpecificFields()}

        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2">Styles</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs">Color</label>
              <input
                type="color"
                value={block.styles.color || "#ffffff"}
                onChange={(e) =>
                  handleCommonStyleChange("color", e.target.value)
                }
                className="w-full h-8 bg-gray-700 border border-gray-600 rounded"
              />
            </div>
            <div>
              <label className="block text-xs">Background</label>
              <input
                type="color"
                value={block.styles.backgroundColor || "#000000"}
                onChange={(e) =>
                  handleCommonStyleChange("backgroundColor", e.target.value)
                }
                className="w-full h-8 bg-gray-700 border border-gray-600 rounded"
              />
            </div>
          </div>
          <div className="mt-2">
            <label className="block text-xs">Font Size</label>
            <input
              type="text"
              value={block.styles.fontSize || ""}
              onChange={(e) =>
                handleCommonStyleChange("fontSize", e.target.value)
              }
              placeholder="e.g. 16px, 1.5rem"
              className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-sm"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onDelete}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Delete Block
        </button>
      </div>
    </div>
  );
}; 