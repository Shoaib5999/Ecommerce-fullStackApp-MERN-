import { useState, useContext, createContext, useEffect } from "react";
import { normalizeCart } from "../utils/cartUtils";

const CartContext = createContext();
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    let existingCartItem = localStorage.getItem("cart");
    if (existingCartItem) {
      try {
        setCart(normalizeCart(JSON.parse(existingCartItem)));
      } catch (err) {
        setCart([]);
      }
    }
  }, []);

  return (
    <CartContext.Provider value={[cart, setCart]}>
      {children}
    </CartContext.Provider>
  );
};

// custom hook
const useCart = () => useContext(CartContext);
export { useCart, CartProvider };
