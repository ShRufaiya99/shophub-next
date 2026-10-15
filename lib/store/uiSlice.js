import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { hydrated: false, toast: null },
  reducers: {
    setHydrated: (state) => {
      state.hydrated = true;
    },
    setToast: (state, action) => {
      state.toast = action.payload;
    },
    clearToast: (state, action) => {
      // only clear if it is still the same toast (a newer one may have replaced it)
      if (!action.payload || state.toast?.id === action.payload) state.toast = null;
    },
  },
});

export const { setHydrated, setToast, clearToast } = uiSlice.actions;

// thunk: show a toast for ~2.6 seconds
export const showToast =
  (message, type = "success") =>
  (dispatch) => {
    const id = Date.now() + Math.random();
    dispatch(setToast({ message, type, id }));
    setTimeout(() => dispatch(clearToast(id)), 2600);
  };

export default uiSlice.reducer;
