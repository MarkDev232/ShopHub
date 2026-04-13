import React, { useState } from "react";

interface SkuGeneratorProps {
  productName: string;
  categoryName: string;
  onGenerate?: (sku: string) => void;
}

const SkuGenerator: React.FC<SkuGeneratorProps> = ({
  productName,
  categoryName,
  onGenerate,
}) => {
  const [sku, setSku] = useState("");

  const formatPart = (text: string) => {
    return text
      .replace(/[^a-zA-Z0-9]/g, "") // remove special chars
      .toUpperCase()
      .slice(0, 3); // take first 3 chars
  };

  const generateSKU = () => {
    const productPart = formatPart(productName || "PRD");
    const categoryPart = formatPart(categoryName || "GEN");

    const timestampPart = Date.now().toString().slice(-5);

    const newSku = `${productPart}-${categoryPart}-${timestampPart}`;

    setSku(newSku);
    onGenerate?.(newSku);
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={generateSKU}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Generate SKU
      </button>

      {sku && (
        <p className="text-gray-700 font-mono">
          Generated SKU: {sku}
        </p>
      )}
    </div>
  );
};

export default SkuGenerator;