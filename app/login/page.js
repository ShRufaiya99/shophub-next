"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/components/AppProvider";

const DEMO = { username: "emilys", password: "emilyspass" };

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { hydrated, user, login, register, showToast } = useApp();

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
