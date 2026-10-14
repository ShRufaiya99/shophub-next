import { createSlice } from "@reduxjs/toolkit";
import { salePrice } from "@/lib/format";

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    setCart: (_state, action) => action.payload,

    addItem: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const qty = Math.max(1, quantity);
      const max = product.stock ?? 99;
      const existing = state.find((i) => i.id === product.id);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + qty, max || 99);
        return;
      }
      state.push({
        id: product.id,
        title: product.title,
        price: salePrice(product),
        thumbnail: product.thumbnail,
        brand: product.brand || "",
        stock: max,
        quantity: Math.min(qty, max || 99),
      });
    },

    removeItem: (state, action) => state.filter((i) => i.id !== action.payload),

    setQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.find((i) => i.id === id);
      if (item) item.quantity = Math.min(quantity, item.stock || 99);
      return state.filter((i) => i.quantity > 0);
    },

    clearCart: () => [],
  },
});

export const { setCart, addItem, removeItem, setQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
