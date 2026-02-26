import { useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { useCurrency, CURRENCIES } from "../context/CurrencyContext";
import { FaCheck } from "react-icons/fa";

export default function Settings() {
  const { currency, setCurrency } = useCurrency();
  const [selected, setSelected] = useState(currency);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const hasChanges = selected !== currency;

  const handleSave = async () => {
    if (!hasChanges) return;
    try {
      setSaving(true);
      await setCurrency(selected);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout title="Settings">
      <div className="max-w-2xl mx-auto">

        {/* ── Currency Preference ──────────────────────────────────────── */}
        <section
          className="p-8 rounded-2xl
          bg-white dark:bg-darkCard
          border border-gray-200 dark:border-darkBorder
          shadow-sm mb-6"
        >
          <h2 className="text-xl font-bold mb-1">Display Currency</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            All portfolio values and prices will be shown in your selected currency.
            Live rates are fetched hourly.
          </p>

          {/* Currency options */}
          <div className="flex flex-col gap-3">
            {Object.values(CURRENCIES).map((c) => {
              const isSelected = selected === c.code;
              return (
                <button
                  key={c.code}
                  onClick={() => setSelected(c.code)}
                  className={`flex items-center justify-between px-5 py-4 rounded-xl border
                  transition-all duration-150
                  ${isSelected
                    ? "border-lightAccent dark:border-darkAccent bg-lightAccent/5 dark:bg-darkAccent/10"
                    : "border-gray-200 dark:border-darkBorder hover:bg-gray-50 dark:hover:bg-darkBg"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Symbol badge */}
                    <span
                      className={`w-10 h-10 rounded-full flex items-center justify-center
                      text-lg font-bold
                      ${isSelected
                        ? "bg-lightAccent dark:bg-darkAccent text-white dark:text-black"
                        : "bg-gray-100 dark:bg-darkBg text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {c.symbol}
                    </span>
                    <div className="text-left">
                      <p className={`font-semibold ${isSelected ? "text-lightAccent dark:text-darkAccent" : ""}`}>
                        {c.code}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {c.label}
                      </p>
                    </div>
                  </div>

                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-lightAccent dark:bg-darkAccent
                      flex items-center justify-center">
                      <FaCheck size={10} className="text-white dark:text-black" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Save button */}
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className={`px-6 py-2.5 rounded-xl font-medium transition
              ${hasChanges && !saving
                ? "bg-lightAccent dark:bg-darkAccent text-white dark:text-black hover:scale-105"
                : "bg-gray-200 dark:bg-darkBg text-gray-400 cursor-not-allowed"
              }`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            {/* Success confirmation */}
            {saved && (
              <span className="flex items-center gap-2 text-green-500 text-sm font-medium
                animate-[fadeIn_0.3s_ease-out]">
                <FaCheck size={12} />
                Saved successfully
              </span>
            )}
          </div>
        </section>

        {/* ── More settings sections can be added below ────────────────── */}
        <section
          className="p-8 rounded-2xl
          bg-white dark:bg-darkCard
          border border-gray-200 dark:border-darkBorder
          shadow-sm opacity-50"
        >
          <h2 className="text-xl font-bold mb-1">Notifications</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Coming soon — price alerts and portfolio summaries.
          </p>
        </section>

      </div>
    </AppLayout>
  );
}