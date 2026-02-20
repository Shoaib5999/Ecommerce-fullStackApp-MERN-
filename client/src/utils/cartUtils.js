export const normalizeCart = (cart) =>
  (cart ?? []).map((item) => ({
    ...item,
    qty: item?.qty && item.qty > 0 ? item.qty : 1,
  }));

export const addToCart = (cart, product, qty = 1) => {
  if (!product?._id) return cart ?? [];
  const safeQty = Number.isFinite(qty) && qty > 0 ? qty : 1;
  const existing = (cart ?? []).find((item) => item._id === product._id);
  if (existing) {
    return (cart ?? []).map((item) =>
      item._id === product._id
        ? { ...item, qty: (item.qty || 1) + safeQty }
        : item
    );
  }
  return [...(cart ?? []), { ...product, qty: safeQty }];
};

export const updateCartQty = (cart, id, qty) => {
  if (!id) return cart ?? [];
  const safeQty = Number.isFinite(qty) ? qty : 1;
  if (safeQty <= 0) return (cart ?? []).filter((item) => item._id !== id);
  return (cart ?? []).map((item) =>
    item._id === id ? { ...item, qty: safeQty } : item
  );
};

export const cartCount = (cart) =>
  (cart ?? []).reduce((sum, item) => sum + (item?.qty || 1), 0);

export const cartSubtotal = (cart) =>
  (cart ?? []).reduce(
    (sum, item) => sum + (item?.price || 0) * (item?.qty || 1),
    0
  );
