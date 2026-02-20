export const normalizeWishlist = (wishlist) => wishlist ?? [];

export const addToWishlist = (wishlist, product) => {
  if (!product?._id) return wishlist ?? [];
  const exists = (wishlist ?? []).some((item) => item._id === product._id);
  if (exists) return wishlist ?? [];
  return [...(wishlist ?? []), product];
};

export const removeFromWishlist = (wishlist, id) =>
  (wishlist ?? []).filter((item) => item._id !== id);

export const toggleWishlist = (wishlist, product) => {
  if (!product?._id) return wishlist ?? [];
  const exists = (wishlist ?? []).some((item) => item._id === product._id);
  return exists
    ? removeFromWishlist(wishlist, product._id)
    : addToWishlist(wishlist, product);
};

export const wishlistCount = (wishlist) => (wishlist ?? []).length;
