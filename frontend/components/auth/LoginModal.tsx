"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { CITIES } from "@/types";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  city: z.string().optional(),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "Need uppercase")
    .regex(/[a-z]/, "Need lowercase")
    .regex(/[0-9]/, "Need number"),
});

const profileSchema = z.object({
  firstName: z.string().min(1, "Name is required"),
  lastName: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  city: z.string().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;
type ProfileForm = z.infer<typeof profileSchema>;

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  mode?: "auth" | "profile";
}

export default function LoginModal({ open, onClose, mode = "auth" }: LoginModalProps) {
  const { user, login, register, updateProfile, logout } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [panel, setPanel] = useState<"auth" | "profile">(mode);

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });
  const profileForm = useForm<ProfileForm>({ resolver: zodResolver(profileSchema) });

  useEffect(() => {
    if (open) {
      setPanel(mode);
      if (mode === "profile" && user) {
        profileForm.reset({
          firstName: user.firstName,
          lastName: user.lastName || "",
          email: user.email,
          phone: user.phone || "",
          city: user.city || "",
        });
      }
    }
  }, [open, mode, user, profileForm]);

  if (!open) return null;

  const showProfile = panel === "profile" && user;

  const handleLogin = async (data: LoginForm) => {
    console.log("Submitting:", { email: data.email, password: "[REDACTED]" });
    const err = await login(data.email, data.password);
    if (err) toast(err, "error");
    else {
      toast(`Welcome back! 👋`, "success");
      onClose();
    }
  };

  const handleRegister = async (data: RegisterForm) => {
    console.log("Submitting:", { ...data, password: "[REDACTED]" });
    const err = await register(data);
    if (err) toast(err, "error");
    else {
      toast(`Welcome to NextBuzz, ${data.firstName}! 🎉`, "success");
      onClose();
    }
  };

  const handleSaveProfile = async (data: ProfileForm) => {
    console.log("Submitting:", data);
    const err = await updateProfile({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      city: data.city,
    });
    if (err) toast(err, "error");
    else {
      toast("Profile saved! ✓", "success");
      onClose();
    }
  };

  return (
    <div className={`overlay ${open ? "open" : ""}`} onClick={onClose}>
      <div className="modal login-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute right-[18px] top-[18px] flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg3)] text-[var(--muted)] transition-colors hover:text-[var(--white)]"
          onClick={onClose}
        >
          ✕
        </button>

        {!showProfile ? (
          <>
            <div className="border-b border-[var(--border)] px-9 pb-6 pt-9 max-md:px-5 max-md:pt-6">
              <h3 className="font-head mb-1.5 text-[1.7rem] font-black tracking-[-1px]">
                Welcome to NextBuzz 👋
              </h3>
              <p className="text-[0.88rem] text-[var(--muted)]">
                Sign in to book events and save your details
              </p>
            </div>
            <div className="px-9 py-7 text-center max-md:px-5 max-md:py-5">
              <div className="mb-6 flex gap-0 rounded-xl bg-[var(--bg3)] p-1">
                <button
                  className={`flex-1 rounded-[10px] border-none px-2.5 py-2.5 font-body text-[0.88rem] font-bold transition-all ${
                    tab === "login"
                      ? "bg-[var(--orange)] text-white"
                      : "bg-transparent text-[var(--muted)]"
                  }`}
                  onClick={() => setTab("login")}
                >
                  Sign In
                </button>
                <button
                  className={`flex-1 rounded-[10px] border-none px-2.5 py-2.5 font-body text-[0.88rem] font-bold transition-all ${
                    tab === "register"
                      ? "bg-[var(--orange)] text-white"
                      : "bg-transparent text-[var(--muted)]"
                  }`}
                  onClick={() => setTab("register")}
                >
                  Create Account
                </button>
              </div>

              {tab === "login" ? (
                <form onSubmit={loginForm.handleSubmit(handleLogin)}>
                  <div className="mb-3.5 flex flex-col gap-1.5 text-left">
                    <label className="text-[0.8rem] font-bold uppercase tracking-[0.04em] text-[var(--muted)]">
                      Email Address
                    </label>
                    <input
                      {...loginForm.register("email")}
                      type="email"
                      placeholder="you@gmail.com"
                      className="rounded-xl border-[1.5px] border-[var(--border)] bg-[var(--bg3)] px-4 py-3 font-body text-[0.9rem] text-[var(--white)] outline-none focus:border-[rgba(255,107,53,0.5)]"
                    />
                    {loginForm.formState.errors.email && (
                      <span className="text-xs text-[var(--rose)]">
                        {loginForm.formState.errors.email.message}
                      </span>
                    )}
                  </div>
                  <div className="mb-3.5 flex flex-col gap-1.5 text-left">
                    <label className="text-[0.8rem] font-bold uppercase tracking-[0.04em] text-[var(--muted)]">
                      Password
                    </label>
                    <input
                      {...loginForm.register("password")}
                      type="password"
                      placeholder="••••••••"
                      className="rounded-xl border-[1.5px] border-[var(--border)] bg-[var(--bg3)] px-4 py-3 font-body text-[0.9rem] text-[var(--white)] outline-none focus:border-[rgba(255,107,53,0.5)]"
                    />
                  </div>
                  <button type="submit" className="btn-full">
                    Sign In →
                  </button>
                  <p className="mt-3.5 text-center text-[0.8rem] text-[var(--muted)]">
                    Don&apos;t have an account?{" "}
                    <span
                      onClick={() => setTab("register")}
                      className="cursor-pointer font-bold text-[var(--orange)]"
                    >
                      Create one free
                    </span>
                  </p>
                </form>
              ) : (
                <form onSubmit={registerForm.handleSubmit(handleRegister)}>
                  <div className="mb-3.5 grid grid-cols-2 gap-3.5 max-md:grid-cols-1">
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[0.8rem] font-bold uppercase tracking-[0.04em] text-[var(--muted)]">
                        First Name *
                      </label>
                      <input
                        {...registerForm.register("firstName")}
                        placeholder="Aarav"
                        className="rounded-xl border-[1.5px] border-[var(--border)] bg-[var(--bg3)] px-4 py-3 font-body text-[0.9rem] text-[var(--white)] outline-none focus:border-[rgba(255,107,53,0.5)]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[0.8rem] font-bold uppercase tracking-[0.04em] text-[var(--muted)]">
                        Last Name
                      </label>
                      <input
                        {...registerForm.register("lastName")}
                        placeholder="Sharma"
                        className="rounded-xl border-[1.5px] border-[var(--border)] bg-[var(--bg3)] px-4 py-3 font-body text-[0.9rem] text-[var(--white)] outline-none focus:border-[rgba(255,107,53,0.5)]"
                      />
                    </div>
                  </div>
                  <div className="mb-3.5 flex flex-col gap-1.5 text-left">
                    <label className="text-[0.8rem] font-bold uppercase tracking-[0.04em] text-[var(--muted)]">
                      Email Address *
                    </label>
                    <input
                      {...registerForm.register("email")}
                      type="email"
                      placeholder="you@gmail.com"
                      className="rounded-xl border-[1.5px] border-[var(--border)] bg-[var(--bg3)] px-4 py-3 font-body text-[0.9rem] text-[var(--white)] outline-none focus:border-[rgba(255,107,53,0.5)]"
                    />
                  </div>
                  <div className="mb-3.5 flex flex-col gap-1.5 text-left">
                    <label className="text-[0.8rem] font-bold uppercase tracking-[0.04em] text-[var(--muted)]">
                      WhatsApp Number
                    </label>
                    <input
                      {...registerForm.register("phone")}
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="rounded-xl border-[1.5px] border-[var(--border)] bg-[var(--bg3)] px-4 py-3 font-body text-[0.9rem] text-[var(--white)] outline-none focus:border-[rgba(255,107,53,0.5)]"
                    />
                  </div>
                  <div className="mb-3.5 flex flex-col gap-1.5 text-left">
                    <label className="text-[0.8rem] font-bold uppercase tracking-[0.04em] text-[var(--muted)]">
                      City
                    </label>
                    <select
                      {...registerForm.register("city")}
                      className="rounded-xl border-[1.5px] border-[var(--border)] bg-[var(--bg3)] px-4 py-3 font-body text-[0.9rem] text-[var(--white)] outline-none focus:border-[rgba(255,107,53,0.5)]"
                    >
                      <option value="">Select your city</option>
                      {CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3.5 flex flex-col gap-1.5 text-left">
                    <label className="text-[0.8rem] font-bold uppercase tracking-[0.04em] text-[var(--muted)]">
                      Password *
                    </label>
                    <input
                      {...registerForm.register("password")}
                      type="password"
                      placeholder="••••••••"
                      className="rounded-xl border-[1.5px] border-[var(--border)] bg-[var(--bg3)] px-4 py-3 font-body text-[0.9rem] text-[var(--white)] outline-none focus:border-[rgba(255,107,53,0.5)]"
                    />
                    {registerForm.formState.errors.password && (
                      <span className="text-xs text-[var(--rose)]">
                        {registerForm.formState.errors.password.message}
                      </span>
                    )}
                  </div>
                  <button type="submit" className="btn-full">
                    Create Account →
                  </button>
                  <p className="mt-3.5 text-center text-[0.8rem] text-[var(--muted)]">
                    Already have an account?{" "}
                    <span
                      onClick={() => setTab("login")}
                      className="cursor-pointer font-bold text-[var(--orange)]"
                    >
                      Sign in
                    </span>
                  </p>
                </form>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="border-b border-[var(--border)] px-9 pb-6 pt-9 max-md:px-5">
              <h3 className="font-head mb-1.5 text-[1.7rem] font-black tracking-[-1px]">
                My Profile ✨
              </h3>
              <p className="text-[0.88rem] text-[var(--muted)]">Update your saved details</p>
            </div>
            <div className="px-9 py-7 max-md:px-5">
              <form onSubmit={profileForm.handleSubmit(handleSaveProfile)}>
                <div className="mb-4 rounded-[14px] border border-[rgba(255,107,53,0.15)] bg-[rgba(255,107,53,0.06)] p-4">
                  <div className="mb-3 text-[0.78rem] font-extrabold uppercase tracking-[0.06em] text-[var(--orange)]">
                    👤 Personal Info
                  </div>
                  <div className="mb-2.5 grid grid-cols-2 gap-3.5 max-md:grid-cols-1">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.8rem] font-bold uppercase tracking-[0.04em] text-[var(--muted)]">
                        Full Name
                      </label>
                      <input
                        {...profileForm.register("firstName")}
                        className="rounded-xl border-[1.5px] border-[var(--border)] bg-[var(--bg3)] px-4 py-3 text-[0.9rem] text-[var(--white)] outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.8rem] font-bold uppercase tracking-[0.04em] text-[var(--muted)]">
                        Email
                      </label>
                      <input
                        {...profileForm.register("email")}
                        type="email"
                        disabled
                        className="rounded-xl border-[1.5px] border-[var(--border)] bg-[var(--bg3)] px-4 py-3 text-[0.9rem] text-[var(--muted)] outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3.5 max-md:grid-cols-1">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.8rem] font-bold uppercase tracking-[0.04em] text-[var(--muted)]">
                        WhatsApp
                      </label>
                      <input
                        {...profileForm.register("phone")}
                        type="tel"
                        className="rounded-xl border-[1.5px] border-[var(--border)] bg-[var(--bg3)] px-4 py-3 text-[0.9rem] text-[var(--white)] outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.8rem] font-bold uppercase tracking-[0.04em] text-[var(--muted)]">
                        City
                      </label>
                      <select
                        {...profileForm.register("city")}
                        className="rounded-xl border-[1.5px] border-[var(--border)] bg-[var(--bg3)] px-4 py-3 text-[0.9rem] text-[var(--white)] outline-none"
                      >
                        <option value="">Select city</option>
                        {CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn-full">
                  Save Changes ✓
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onClose();
                    toast("Signed out. See you soon! 👋");
                  }}
                  className="mt-2.5 w-full cursor-pointer rounded-[14px] border border-[rgba(255,77,109,0.25)] bg-[rgba(255,77,109,0.1)] px-4 py-3 font-body text-[0.9rem] font-bold text-[var(--rose)]"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function useLoginModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"auth" | "profile">("auth");
  return {
    open,
    mode,
    openLogin: () => {
      setMode("auth");
      setOpen(true);
    },
    openProfile: () => {
      setMode("profile");
      setOpen(true);
    },
    close: () => setOpen(false),
  };
}
