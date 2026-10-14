"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { Provider, useDispatch, useSelector, useStore } from "react-redux";
import { SHIPPING_FEE, SHIPPING_FREE_OVER } from "@/lib/format";
import { makeStore } from "@/lib/store/store";
import { KEYS, read, write } from "@/lib/store/storage";
import { loginUser, logout as logoutAction, registerUser, setUser, updateProfile as updateProfileAction } from "@/lib/store/authSlice";
import { addItem, clearCart as clearCartAction, removeItem, setCart, setQuantity as setQuantityAction } from "@/lib/store/cartSlice";
import { placeOrder as placeOrderThunk, setOrders } from "@/lib/store/ordersSlice";
import { setHydrated, showToast as showToastThunk } from "@/lib/store/uiSlice";
import { setWishlist, toggleWishlist as toggleWishlistAction } from "@/lib/store/wishlistSlice";

/**
 * Loads saved data from localStorage into the Redux store (after the first render,
 * so the server HTML and the first client render match), then saves every change back.
 */
function StorageSync() {
  const store = useStore();

  useEffect(() => {
    const load = () => {
      const { dispatch } = store;
      dispatch(setUser(read(KEYS.auth, null)));
      dispatch(setCart(read(KEYS.cart, [])));
      dispatch(setWishlist(read(KEYS.wishlist, [])));
      dispatch(setOrders(read(KEYS.orders, [])));
    };

    load();
    store.dispatch(setHydrated());

    // save to localStorage whenever one of these slices changes
    let prev = store.getState();
    const unsubscribe = store.subscribe(() => {
      const next = store.getState();
      if (next.auth.user !== prev.auth.user) write(KEYS.auth, next.auth.user);
      if (next.cart !== prev.cart) write(KEYS.cart, next.cart);
      if (next.wishlist !== prev.wishlist) write(KEYS.wishlist, next.wishlist);
      if (next.orders !== prev.orders) write(KEYS.orders, next.orders);
      prev = next;
    });

    // keep several open tabs in sync
    const onStorage = (e) => {
      if (e.key && Object.values(KEYS).includes(e.key)) load();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      unsubscribe();
      window.removeEventListener("storage", onStorage);
    };
  }, [store]);

  return null;
}

export default function AppProvider({ children }) {
  const storeRef = useRef(null);
  if (!storeRef.current) storeRef.current = makeStore();

  return (
    <Provider store={storeRef.current}>
      <StorageSync />
      {children}
    </Provider>
  );
}

/**
 * Same API as before, so no other component had to change:
 * const { cart, addToCart, user, login, ... } = useApp();
 */
export function useApp() {
  const dispatch = useDispatch();

  const hydrated = useSelector((s) => s.ui.hydrated);
  const toast = useSelector((s) => s.ui.toast);
  const user = useSelector((s) => s.auth.user);
  const cart = useSelector((s) => s.cart);
  const wishlist = useSelector((s) => s.wishlist);
  const allOrders = useSelector((s) => s.orders);

  /* ---- toast ---- */
  const showToast = useCallback((message, type) => dispatch(showToastThunk(message, type)), [dispatch]);

  /* ---- cart ---- */
  const addToCart = useCallback(
    (product, quantity = 1) => {
      dispatch(addItem({ product, quantity }));
      dispatch(showToastThunk(`"${product.title}" added to cart`));
    },
    [dispatch]
  );
  const removeFromCart = useCallback((id) => dispatch(removeItem(id)), [dispatch]);
  const setQuantity = useCallback((id, quantity) => dispatch(setQuantityAction({ id, quantity })), [dispatch]);
  const clearCart = useCallback(() => dispatch(clearCartAction()), [dispatch]);

  const cartCount = useMemo(() => cart.reduce((sum, i) => sum + i.quantity, 0), [cart]);
  const cartSubtotal = useMemo(() => cart.reduce((sum, i) => sum + i.price * i.quantity, 0), [cart]);
  const shipping = cart.length === 0 || cartSubtotal >= SHIPPING_FREE_OVER ? 0 : SHIPPING_FEE;
  const cartTotal = cartSubtotal + shipping;

  /* ---- wishlist ---- */
  const isWished = useCallback((id) => wishlist.some((p) => p.id === id), [wishlist]);
  const toggleWishlist = useCallback(
    (product) => {
      const was = wishlist.some((p) => p.id === product.id);
      dispatch(toggleWishlistAction(product));
      dispatch(showToastThunk(was ? "Removed from wishlist" : "Added to wishlist", was ? "info" : "success"));
    },
    [dispatch, wishlist]
  );

  /* ---- auth (the thunks throw an Error with the message on failure) ---- */
  const login = useCallback(
    (username, password) => dispatch(loginUser({ username, password })).unwrap(),
    [dispatch]
  );
  const register = useCallback((form) => dispatch(registerUser(form)).unwrap(), [dispatch]);
  const logout = useCallback(() => {
    dispatch(logoutAction());
    dispatch(showToastThunk("Logged out", "info"));
  }, [dispatch]);
  const updateProfile = useCallback(
    (changes) => {
      dispatch(updateProfileAction(changes));
      dispatch(showToastThunk("Profile updated"));
    },
    [dispatch]
  );

  /* ---- orders ---- */
  const placeOrder = useCallback((details) => dispatch(placeOrderThunk(details)).unwrap(), [dispatch]);
  const orders = useMemo(
    () => allOrders.filter((o) => o.userId === (user?.id ?? null)),
    [allOrders, user]
  );

  /* ---- newsletter ---- */
  const subscribe = useCallback(
    (email) => {
      const list = read(KEYS.newsletter, []);
      if (!list.includes(email)) write(KEYS.newsletter, [...list, email]);
      dispatch(showToastThunk("Thanks for subscribing!"));
    },
    [dispatch]
  );

  return {
    hydrated,
    user,
    login,
    register,
    logout,
    updateProfile,
    cart,
    cartCount,
    cartSubtotal,
    shipping,
    cartTotal,
    addToCart,
    removeFromCart,
    setQuantity,
    clearCart,
    wishlist,
    toggleWishlist,
    isWished,
    orders,
    placeOrder,
    subscribe,
    toast,
    showToast,
  };
}
