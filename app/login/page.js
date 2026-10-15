"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/components/AppProvider";

const DEMO = { username: "emilys", password: "emilyspass" };

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { hydrated, user, login, register, loginWithGoogle, showToast } = useApp();

  const rawNext = params.get("next") || "/dashboard";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";

  const [mode, setMode] = useState(params.get("tab") === "register" ? "register" : "login");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // already logged in -> go on
  useEffect(() => {
    if (hydrated && user) router.replace(next);
  }, [hydrated, user, next, router]);

  async function doLogin(username, password) {
    setBusy(true);
    setError("");
    try {
      const u = await login(username, password);
      showToast(`Welcome back, ${u.firstName || u.username}!`);
      router.replace(next);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  async function doGoogleLogin() {
    setBusy(true);
    setError("");
    try {
      const u = await loginWithGoogle();
      showToast(`Welcome, ${u.firstName || u.username}!`);
      router.replace(next);
    } catch (err) {
      if (err?.code === "auth/popup-closed-by-user") {
        setError("Google sign-in popup was closed.");
      } else {
        setError(err.message || "Google sign-in failed");
      }
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (mode === "login") {
      doLogin(form.username, form.password);
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const u = await register(form);
      showToast(`Account created. Welcome, ${u.firstName}!`);
      router.replace(next);
    } catch (err) {
      setError(err.message || "Could not create account");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container flex justify-center py-10 md:py-16">
      <div className="w-full max-w-md rounded-lg border border-border-btn bg-white p-6 shadow-sm">
        <div className="mb-6 grid grid-cols-2 rounded-lg bg-g p-1 font-inter text-sm font-semibold">
          {["login", "register"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError("");
              }}
              className={`rounded-md py-2 capitalize cursor-pointer ${
                mode === m ? "bg-white text-blue shadow" : "text-gray"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <h1 className="page-title text-center">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {mode === "register" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label" htmlFor="firstName">First name</label>
                  <input id="firstName" className="field" required value={form.firstName} onChange={set("firstName")} />
                </div>
                <div>
                  <label className="label" htmlFor="lastName">Last name</label>
                  <input id="lastName" className="field" required value={form.lastName} onChange={set("lastName")} />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="email">Email</label>
                <input id="email" type="email" className="field" required value={form.email} onChange={set("email")} />
              </div>
            </>
          )}

          {mode === "login" && (
            <div>
              <label className="label" htmlFor="username">Username or email</label>
              <input
                id="username"
                className="field"
                required
                autoComplete="username"
                value={form.username}
                onChange={set("username")}
              />
            </div>
          )}

          <div>
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="field"
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={form.password}
              onChange={set("password")}
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red/10 px-3 py-2 font-inter text-sm text-red">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
          </button>
        </form>

        <div className="relative my-4 flex items-center justify-center">
          <div className="w-full border-t border-border-btn" />
          <span className="absolute bg-white px-2 font-inter text-xs uppercase tracking-wider text-gray">
            or
          </span>
        </div>

        <button
          type="button"
          onClick={doGoogleLogin}
          disabled={busy}
          className="btn-outline w-full cursor-pointer font-inter text-sm"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        {mode === "login" && (
          <div className="mt-5 rounded-lg bg-sky p-3 font-inter text-sm text-primary">
            <p className="font-semibold">Demo account</p>
            <p>
              Username: <b>{DEMO.username}</b> · Password: <b>{DEMO.password}</b>
            </p>
            <button
              type="button"
              onClick={() => doLogin(DEMO.username, DEMO.password)}
              className="mt-2 font-semibold text-blue hover:underline cursor-pointer"
              disabled={busy}
            >
              Login with demo account →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container py-12"><div className="skeleton h-96" /></div>}>
      <LoginInner />
    </Suspense>
  );
}
