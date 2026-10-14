import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: [],
  reducers: {
    setWishlist: (_state, action) => action.payload,

    toggleWishlist: (state, action) => {
      const p = action.payload;
      const index = state.findIndex((x) => x.id === p.id);
      if (index >= 0) {
        state.splice(index, 1);
        return;
      }
      state.push({
        id: p.id,
        title: p.title,
        price: p.price,
        discountPercentage: p.discountPercentage,
        thumbnail: p.thumbnail,
        description: p.description,
        category: p.category,
        rating: p.rating,
        stock: p.stock,
        brand: p.brand,
      });
    },
  },
});

export const { setWishlist, toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
