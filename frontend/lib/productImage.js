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

export const getProductImageCandidates = (product) => {
  if (!product) return [];

  const normalize = (value) => {
    if (typeof value !== "string") return "";
    let cleaned = value.trim();
    if (!cleaned || cleaned === "null" || cleaned === "undefined") return "";

    if (cleaned.startsWith("data:image/")) {
      const commaIndex = cleaned.indexOf(",");
      if (commaIndex > -1) {
        const header = cleaned.slice(0, commaIndex + 1);
        const payload = cleaned.slice(commaIndex + 1).replace(/\s+/g, "");
        cleaned = `${header}${payload}`;
      }
    }

    return cleaned;
  };

  const collect = (entry) => {
    if (typeof entry === "string") return normalize(entry);
    if (entry && typeof entry.url === "string") return normalize(entry.url);
    return "";
  };

  const out = [];
  const push = (value) => {
    if (value && !out.includes(value)) out.push(value);
  };

  push(collect(product.image));
  if (Array.isArray(product.images)) {
    product.images.forEach((entry) => push(collect(entry)));
  } else {
    push(normalize(product.images));
  }

  return out;
};
