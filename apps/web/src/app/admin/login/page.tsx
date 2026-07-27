"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@strokealert/shared";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Logo from "../../components/ui/Logo";
import GridLines from "../../components/ui/GridLines";
import SplitLines from "../../components/ui/SplitLines";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/Field";
import { ArrowRightIcon } from "../../components/ui/Icons";
import { DUR, EASE } from "../../components/ui/motion";
import { API_URL } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    setServerError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setServerError(result.error || "Login failed");
        return;
      }
      if (result.data?.token) localStorage.setItem("admin_token", result.data.token);
      router.push("/admin");
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* signal panel */}
      <div className="relative overflow-hidden bg-signal px-inset py-12 text-signal-ink lg:py-16">
        <GridLines className="opacity-20" columns={6} />

        <div className="relative flex h-full flex-col justify-between gap-16">
          <Logo size="lg" invert />

          <div>
            <p className="font-mono text-label uppercase tracking-[0.14em] text-signal-ink/70">
              Hospital network console
            </p>
            <SplitLines
              as="h1"
              lines={["Keep the", "network", "accurate."]}
              className="mt-5 text-display-l font-extrabold uppercase"
            />
            <p className="mt-6 max-w-[34ch] text-body-l text-signal-ink/80">
              Every record here is what someone reads while a stroke is in progress. Phone numbers,
              coordinates and opening hours have to be right.
            </p>
          </div>

          <p className="font-mono text-micro uppercase tracking-[0.16em] text-signal-ink/60">
            Authorised personnel only
          </p>
        </div>
      </div>

      {/* form panel */}
      <div className="flex items-center justify-center px-inset py-14">
        <motion.div
          className="w-full max-w-[420px]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR.reveal, ease: EASE, delay: 0.15 }}
        >
          <p className="label border-b border-ink pb-3">Sign in</p>

          {serverError && (
            <motion.p
              className="mt-5 border border-signal px-4 py-3 font-mono text-micro uppercase tracking-[0.14em] text-signal"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
            >
              {serverError}
            </motion.p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-7">
            <TextField
              id="email"
              label="Email"
              required
              type="email"
              autoComplete="email"
              placeholder="admin@strokealert.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <TextField
              id="password"
              label="Password"
              required
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />

            <Button
              type="submit"
              variant="ink"
              size="lg"
              full
              disabled={loading}
              icon={<ArrowRightIcon className="h-4 w-4" />}
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <a
            href="/"
            className="mt-8 inline-block font-mono text-micro uppercase tracking-[0.14em] text-ink-3 transition-colors hover:text-signal"
          >
            ← Back to the emergency page
          </a>
        </motion.div>
      </div>
    </div>
  );
}
