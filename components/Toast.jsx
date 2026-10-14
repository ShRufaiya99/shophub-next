"use client";

import { CheckCircle2, Info } from "lucide-react";
import { useApp } from "@/components/AppProvider";

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  const Icon = toast.type === "info" ? Info : CheckCircle2;
  return (
    <div
      key={toast.id}
      role="status"
      className="fixed bottom-5 right-5 z-[100] flex max-w-[calc(100vw-2.5rem)] items-center gap-2 rounded-lg bg-black px-4 py-3 font-inter text-sm text-white shadow-lg"
    >
      <Icon size={18} className={toast.type === "info" ? "text-sky" : "text-green"} />
      <span className="line-clamp-2">{toast.message}</span>
    </div>
  );
}
