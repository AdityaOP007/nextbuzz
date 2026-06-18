"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { User, Event, CartItem } from "@/types";

// ─── Toast ───────────────────────────────────────────────────────────────────
type ToastType = "success" | "error" | undefined;

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<
    { id: number; message: string; type?: ToastType }[]
  >([]);

  const toast = useCallback((message: string, type?: ToastType) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-7 right-7 z-[2000] flex flex-col gap-2.5">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`max-w-[320px] rounded-[14px] border border-[var(--border)] bg-[var(--card)] px-5 py-3.5 text-[0.88rem] font-semibold text-[var(--white)] shadow-[0_10px_30px_rgba(0,0,0,0.4)] animate-[toastIn_0.3s_ease] ${
              t.type === "success"
                ? "border-l-[3px] border-l-[var(--teal)]"
                : t.type === "error"
                  ? "border-l-[3px] border-l-[var(--rose)]"
                  : "border-l-[3px] border-l-[var(--orange)]"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// ─── Auth ────────────────────────────────────────────────────────────────────
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (data: {
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
    city?: string;
    password: string;
  }) => Promise<string | null>;
  logout: () => void;
  updateProfile: (data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    city?: string;
  }) => Promise<string | null>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("nb_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { authService } = await import("@/services/auth.service");
      const res = await authService.getMe();
      if (res.success) setUser(res.data);
    } catch {
      localStorage.removeItem("nb_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    try {
      const { authService } = await import("@/services/auth.service");
      const res = await authService.login(email, password);
      if (res.success) {
        localStorage.setItem("nb_token", res.data.token);
        setUser(res.data.user);
        return null;
      }
      return res.error || "Login failed";
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      console.error(error.response?.data || error);
      return error.response?.data?.error || "Login failed";
    }
  };

  const register = async (data: {
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
    city?: string;
    password: string;
  }) => {
    try {
      const { authService } = await import("@/services/auth.service");
      const res = await authService.register(data);
      if (res.success) {
        localStorage.setItem("nb_token", res.data.token);
        setUser(res.data.user);
        return null;
      }
      return res.error || "Registration failed";
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      console.error(error.response?.data || error);
      return error.response?.data?.error || "Registration failed";
    }
  };

  const logout = () => {
    localStorage.removeItem("nb_token");
    setUser(null);
  };

  const updateProfile = async (data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    city?: string;
  }) => {
    try {
      const { authService } = await import("@/services/auth.service");
      const res = await authService.updateProfile(data);
      if (res.success) {
        setUser(res.data);
        return null;
      }
      return res.error || "Update failed";
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      console.error(error.response?.data || error);
      return error.response?.data?.error || "Update failed";
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateProfile, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// ─── Cart ────────────────────────────────────────────────────────────────────
interface CartContextType {
  cart: CartItem[];
  addToCart: (event: Event) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  toggleCartItem: (event: Event) => Promise<void>;
  isInCart: (id: string) => boolean;
  total: number;
  clearCart: () => Promise<void>;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const saveLocal = useCallback((items: CartItem[]) => {
    localStorage.setItem("nb_cart", JSON.stringify(items));
  }, []);

  const persistCartItem = useCallback(
    async (eventId: string, action: "add" | "remove") => {
      if (!user) return;
      const { cartService } = await import("@/services/cart.service");
      if (action === "add") await cartService.addToCart(eventId);
      else await cartService.removeFromCart(eventId);
    },
    [user]
  );

  useEffect(() => {
    async function loadCart() {
      if (user) {
        try {
          const { cartService } = await import("@/services/cart.service");
          const res = await cartService.getCart();
          if (res.success) {
            setCart(res.data);
            saveLocal(res.data);
            return;
          }
        } catch (error) {
          console.error(error instanceof Error ? error.message : error);
        }
      }
      try {
        const stored = localStorage.getItem("nb_cart");
        setCart(stored ? (JSON.parse(stored) as CartItem[]) : []);
      } catch {
        setCart([]);
      }
    }
    loadCart();
  }, [user, saveLocal]);

  const addToCart = useCallback(
    async (event: Event) => {
      if (event.sold || event.availableSeats <= 0) return;
      if (cart.some((c) => c.id === event.id)) return;
      const newCart = [...cart, event];
      setCart(newCart);
      saveLocal(newCart);
      if (user) {
        try {
          await persistCartItem(event.id, "add");
        } catch (error) {
          setCart(cart);
          saveLocal(cart);
          throw error;
        }
      }
    },
    [cart, saveLocal, user, persistCartItem]
  );

  const removeFromCart = useCallback(
    async (id: string) => {
      const previous = cart;
      const newCart = cart.filter((c) => c.id !== id);
      setCart(newCart);
      saveLocal(newCart);
      if (user) {
        try {
          await persistCartItem(id, "remove");
        } catch (error) {
          setCart(previous);
          saveLocal(previous);
          throw error;
        }
      }
    },
    [cart, saveLocal, user, persistCartItem]
  );

  const toggleCartItem = useCallback(
    async (event: Event) => {
      if (event.sold || event.availableSeats <= 0) return;
      if (cart.some((c) => c.id === event.id)) await removeFromCart(event.id);
      else await addToCart(event);
    },
    [cart, addToCart, removeFromCart]
  );

  const isInCart = useCallback((id: string) => cart.some((c) => c.id === id), [cart]);
  const total = cart.reduce((s, i) => s + i.price, 0);

  const clearCart = useCallback(async () => {
    const previous = cart;
    setCart([]);
    saveLocal([]);
    if (user) {
      try {
        const { cartService } = await import("@/services/cart.service");
        await cartService.syncCart([]);
      } catch (error) {
        setCart(previous);
        saveLocal(previous);
        throw error;
      }
    }
  }, [cart, saveLocal, user]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        toggleCartItem,
        isInCart,
        total,
        clearCart,
        cartOpen,
        setCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

// ─── Root provider ───────────────────────────────────────────────────────────
export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>{children}</ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
