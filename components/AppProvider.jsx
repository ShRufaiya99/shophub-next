"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { Provider, useDispatch, useSelector, useStore } from "react-redux";
import { SHIPPING_FEE, SHIPPING_FREE_OVER } from "@/lib/format";
import { makeStore } from "@/lib/store/store";
import { KEYS, read, write } from "@/lib/store/storage";
import { loginUser, logout as logoutAction, registerUser, loginWithGoogle as loginWithGoogleAction, setUser, updateProfile as updateProfileAction } from "@/lib/store/authSlice";
import { auth, signOut } from "@/lib/firebase";
import { addItem, clearCart as clearCartAction, removeItem, setCart, setQuantity as setQuantityAction } from "@/lib/store/cartSlice";
import { placeOrder as placeOrderThunk, setOrders } from "@/lib/store/ordersSlice";
import { setHydrated, showToast as showToastThunk } from "@/lib/store/uiSlice";
import { setWishlist, toggleWishlist as toggleWishlistAction } from "@/lib/store/wishlistSlice";

import {
  rtdbSaveCart,
  rtdbFetchCart,
  rtdbSaveWishlist,
  rtdbFetchWishlist,
  rtdbSaveProfile,
  rtdbFetchProfile,
  rtdbFetchUserOrders,
} from "@/lib/rtdb";

/**
 * Loads saved data from localStorage into the Redux store (after the first render,
 * so the server HTML and the first client render match), then syncs every change with
 * localStorage and Firebase Realtime Database for persistent cloud e-commerce storage.
 */
function StorageSync() {
  const store = useStore();

  useEffect(() => {
    const load = () => {
      const { dispatch } = store;
      const u = read(KEYS.auth, null);
      dispatch(setUser(u));
      dispatch(setCart(read(KEYS.cart, [])));
      dispatch(setWishlist(read(KEYS.wishlist, [])));
      dispatch(setOrders(read(KEYS.orders, [])));
      if (u?.id) syncFromRtdb(u.id);
    };

    const syncFromRtdb = async (userId) => {
      if (!userId) return;
      try {
        const [cloudOrders, cloudCart, cloudWishlist, cloudProfile] = await Promise.all([
          rtdbFetchUserOrders(userId),
          rtdbFetchCart(userId),
          rtdbFetchWishlist(userId),
          rtdbFetchProfile(userId),
        ]);

        const current = store.getState();

        if (cloudOrders && cloudOrders.length > 0) {
          const existingIds = new Set(current.orders.map((o) => o.id));
          const toAdd = cloudOrders.filter((o) => !existingIds.has(o.id));
          if (toAdd.length > 0) {
            store.dispatch(setOrders([...current.orders, ...toAdd]));
          }
        }

        if (cloudCart && Array.isArray(cloudCart) && cloudCart.length > 0 && current.cart.length === 0) {
          store.dispatch(setCart(cloudCart));
        }

        if (cloudWishlist && Array.isArray(cloudWishlist) && cloudWishlist.length > 0 && current.wishlist.length === 0) {
          store.dispatch(setWishlist(cloudWishlist));
        }

        if (cloudProfile && current.auth.user) {
          store.dispatch(setUser({ ...current.auth.user, ...cloudProfile }));
        }
      } catch (err) {
        console.warn("RTDB sync notice:", err?.message);
      }
    };

    load();
    store.dispatch(setHydrated());

    // save to localStorage and Firebase Realtime Database
    let prev = store.getState();
    const unsubscribe = store.subscribe(() => {
      const next = store.getState();
      if (next.auth.user !== prev.auth.user) {
        write(KEYS.auth, next.auth.user);
        if (next.auth.user?.id) {
          rtdbSaveProfile(next.auth.user.id, next.auth.user);
          if (!prev.auth.user || prev.auth.user.id !== next.auth.user.id) {
            syncFromRtdb(next.auth.user.id);
          }
        }
      }
      if (next.cart !== prev.cart) {
        write(KEYS.cart, next.cart);
        if (next.auth.user?.id) rtdbSaveCart(next.auth.user.id, next.cart);
      }
      if (next.wishlist !== prev.wishlist) {
        write(KEYS.wishlist, next.wishlist);
        if (next.auth.user?.id) rtdbSaveWishlist(next.auth.user.id, next.wishlist);
      }
      if (next.orders !== prev.orders) {
        write(KEYS.orders, next.orders);
      }
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
  const loginWithGoogle = useCallback(
    () => dispatch(loginWithGoogleAction()).unwrap(),
    [dispatch]
  );
  const logout = useCallback(() => {
    try {
      signOut(auth);
    } catch {}
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
    loginWithGoogle,
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
