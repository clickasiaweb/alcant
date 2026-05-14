export const getPrimaryProductImage = (product) => {
  if (!product) return "";

  const normalizedValue = (value) => (typeof value === "string" ? value.trim() : "");
  const isUsable = (value) =>
    typeof value === "string" &&
    value.length > 0 &&
    value !== "null" &&
    value !== "undefined";
  const pickString = (value) => {
    const cleaned = normalizedValue(value);
    return isUsable(cleaned) ? cleaned : "";
  };
  const pickFromEntry = (entry) => {
    if (typeof entry === "string") return pickString(entry);
    if (entry && typeof entry.url === "string") return pickString(entry.url);
    return "";
  };

  const directImage = pickFromEntry(product.image);
  if (directImage) return directImage;

  if (Array.isArray(product.images) && product.images.length > 0) {
    for (const entry of product.images) {
      const candidate = pickFromEntry(entry);
      if (candidate) return candidate;
    }
  }

  const flatImages = pickString(product.images);
  if (flatImages) return flatImages;

  return "";
};
