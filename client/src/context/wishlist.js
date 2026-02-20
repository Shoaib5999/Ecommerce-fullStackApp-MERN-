import { useState, useContext, createContext, useEffect } from "react";
import { normalizeWishlist } from "../utils/wishlistUtils";

const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const existing = localStorage.getItem("wishlist");
    if (existing) {
      try {
        setWishlist(normalizeWishlist(JSON.parse(existing)));
      } catch (err) {
        setWishlist([]);
      }
    }
  }, []);

  return (
    <WishlistContext.Provider value={[wishlist, setWishlist]}>
      {children}
    </WishlistContext.Provider>
  );
};

const useWishlist = () => useContext(WishlistContext);

export { useWishlist, WishlistProvider };
