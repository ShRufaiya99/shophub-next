import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiLogin } from "@/lib/api";
import { KEYS, hashPassword, read, write } from "@/lib/store/storage";
import { auth, googleProvider, signInWithPopup } from "@/lib/firebase";

/* ---------- async thunks ---------- */

export const loginUser = createAsyncThunk("auth/login", async ({ username, password }) => {
  const name = username.trim();

  // 1) accounts registered in this browser
  const users = read(KEYS.users, []);
  const local = users.find(
    (u) =>
      u.username.toLowerCase() === name.toLowerCase() ||
      u.email.toLowerCase() === name.toLowerCase()
  );
  if (local) {
    const hash = await hashPassword(password);
    if (local.passwordHash !== hash) throw new Error("Incorrect password");
    const { passwordHash, ...safe } = local;
    return safe;
  }

  // 2) DummyJSON accounts (e.g. emilys / emilyspass)
  const data = await apiLogin(name, password);
  return {
    id: data.id,
    username: data.username,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    image: data.image,
    phone: data.phone || "",
    address: data.address
      ? `${data.address.address}, ${data.address.city}, ${data.address.state}`
      : "",
    accessToken: data.accessToken,
  };
});

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ firstName, lastName, email, password }) => {
    const users = read(KEYS.users, []);
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("An account with this email already exists");
    }
    const account = {
      id: `u_${Date.now()}`,
      username: email.split("@")[0],
      email,
      firstName,
      lastName,
      image: "",
      phone: "",
      address: "",
      passwordHash: await hashPassword(password),
    };
    write(KEYS.users, [...users, account]);
    const { passwordHash, ...safe } = account;
    return safe;
  }
);

export const loginWithGoogle = createAsyncThunk("auth/loginWithGoogle", async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const fbUser = result.user;

  const displayName = (fbUser.displayName || "").trim();
  const nameParts = displayName ? displayName.split(/\s+/) : [];
  const firstName = nameParts[0] || (fbUser.email ? fbUser.email.split("@")[0] : "User");
  const lastName = nameParts.slice(1).join(" ") || "";
  const email = fbUser.email || "";
  const username = email ? email.split("@")[0] : `user_${fbUser.uid.slice(0, 6)}`;

  const account = {
    id: fbUser.uid,
    username,
    email,
    firstName,
    lastName,
    image: fbUser.photoURL || "",
    phone: fbUser.phoneNumber || "",
    address: "",
  };

  const users = read(KEYS.users, []);
  const existingIdx = users.findIndex(
    (u) => (account.email && u.email?.toLowerCase() === account.email.toLowerCase()) || u.id === account.id
  );

  if (existingIdx >= 0) {
    const updated = {
      ...users[existingIdx],
      ...account,
      image: fbUser.photoURL || users[existingIdx].image || "",
    };
    const updatedList = [...users];
    updatedList[existingIdx] = updated;
    write(KEYS.users, updatedList);
    return updated;
  } else {
    write(KEYS.users, [...users, account]);
    return account;
  }
});

/* ---------- slice ---------- */

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    updateProfile: (state, action) => {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
      // keep the registered-account copy in sync too
      const users = read(KEYS.users, []);
      if (users.some((u) => u.id === state.user.id)) {
        write(
          KEYS.users,
          users.map((u) => (u.id === state.user.id ? { ...u, ...action.payload } : u))
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { setUser, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;

