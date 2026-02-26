import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import API from "../services/Api";

// ── Currency metadata ─────────────────────────────────────────────────────────
export const CURRENCIES = {
  INR: { code: "INR", symbol: "₹", label: "Indian Rupee (₹)" },
  USD: { code: "USD", symbol: "$", label: "US Dollar ($)" },
  EUR: { code: "EUR", symbol: "€", label: "Euro (€)" },
};

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const { user, authLoading } = useAuth();
  const [currency, setCurrencyState] = useState("INR");
  const [currencyLoading, setCurrencyLoading] = useState(true);

  // ── Fetch saved preference when user logs in ──────────────────────────────
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setCurrencyLoading(false);
      return;
    }

    const fetchSettings = async () => {
      try {
        const res = await API.get(`/users/${user.uid}/settings`);
        setCurrencyState(res.data.preferredCurrency || "INR");
      } catch (err) {
        console.error("Failed to fetch currency settings:", err);
      } finally {
        setCurrencyLoading(false);
      }
    };

    fetchSettings();
  }, [user, authLoading]);

  // ── Save preference to DB and update local state ──────────────────────────
  const setCurrency = async (newCurrency) => {
    if (!CURRENCIES[newCurrency]) return;

    try {
      await API.put(`/users/${user.uid}/settings`, {
        preferredCurrency: newCurrency,
      });
      setCurrencyState(newCurrency);
    } catch (err) {
      console.error("Failed to save currency preference:", err);
    }
  };

  const currencyMeta = CURRENCIES[currency] ?? CURRENCIES.INR;

  return (
    <CurrencyContext.Provider
      value={{ currency, currencyMeta, setCurrency, currencyLoading }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}