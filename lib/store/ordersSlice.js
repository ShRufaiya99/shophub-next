import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiCreateCart } from "@/lib/api";
import { SHIPPING_FEE, SHIPPING_FREE_OVER } from "@/lib/format";
import { clearCart } from "@/lib/store/cartSlice";
import { rtdbSaveOrder } from "@/lib/rtdb";

export const placeOrder = createAsyncThunk("orders/place", async (details, { getState, dispatch }) => {
  const { cart, auth } = getState();
  const user = auth.user;

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = cart.length === 0 || subtotal >= SHIPPING_FREE_OVER ? 0 : SHIPPING_FEE;

  const order = {
    id: `SH-${Date.now().toString(36).toUpperCase()}`,
    userId: user?.id ?? null,
    items: cart,
    subtotal,
    shipping,
    total: subtotal + shipping,
    shippingAddress: details,
    payment: details.payment || "Cash on delivery",
    status: "Processing",
    createdAt: new Date().toISOString(),
  };

  // 1) Save order to Firebase Realtime Database in real-time
  try {
    await rtdbSaveOrder(order);
  } catch {}

  // 2) DummyJSON simulates the order
  try {
    if (typeof user?.id === "number") await apiCreateCart(user.id, cart);
  } catch {}

  dispatch(clearCart());
  return order;
});

const ordersSlice = createSlice({
  name: "orders",
  initialState: [],
  reducers: {
    setOrders: (_state, action) => action.payload,
  },
  extraReducers: (builder) => {
    builder.addCase(placeOrder.fulfilled, (state, action) => {
      state.unshift(action.payload);
    });
  },
});

export const { setOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
