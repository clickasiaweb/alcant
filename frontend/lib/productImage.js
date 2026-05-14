export const getPrimaryProductImage = (product) => {
  if (!product) return "";

  if (typeof product.image === "string" && product.image.trim()) {
    return product.image.trim();
  }
  if (product.image && typeof product.image.url === "string" && product.image.url.trim()) {
    return product.image.url.trim();
  }

  if (Array.isArray(product.images) && product.images.length > 0) {
    const first = product.images[0];
    if (typeof first === "string" && first.trim()) return first.trim();
    if (first && typeof first.url === "string" && first.url.trim()) return first.url.trim();
  }

  if (typeof product.images === "string" && product.images.trim()) {
    return product.images.trim();
  }

  return "";
};

