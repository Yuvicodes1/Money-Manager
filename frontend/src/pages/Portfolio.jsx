import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import API from "../services/Api";
import AddInvestmentModal from "../components/AddInvestmentModal";
import EditStockModal from "../components/EditStockModal";
import AppLayout from "../components/layout/AppLayout";
import { FaDownload, FaFilePdf, FaFileCsv } from "react-icons/fa";

const Portfolio = () => {
  const { user, authLoading } = useAuth();
  const { format, convert, currencyMeta, currencyLoading } = useCurrency();

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStock, setEditingStock] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    fetchPortfolio();
  }, [user, authLoading]);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get(`/portfolio/${user.uid}`);
      setPortfolio(res.data);
    } catch (err) {
      console.error("Portfolio load error:", err);
      setError("Failed to load portfolio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (stockId) => {
    try {
      await API.delete("/portfolio/remove-stock", {
        data: { firebaseUID: user.uid, stockId },
      });
      fetchPortfolio();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEditSave = async ({ quantity, buyPrice, estSellPrice }) => {
    await API.put("/portfolio/update-stock", {
      firebaseUID: user.uid,
      stockId: editingStock.stockId,   // use _id, not symbol
      quantity,
      buyPrice,
      estSellPrice,
    });
    fetchPortfolio();
  };


  // ── Export CSV ──────────────────────────────────────────────────────────
  const exportCSV = () => {
    if (!portfolio?.stocks?.length) return;
    const rows = [
      ["Symbol", "Quantity", "Buy Price (USD)", "Current Price (USD)", "Invested", "Current Value", "P/L"],
      ...portfolio.stocks.map((s) => [
        s.symbol, s.quantity, s.buyPrice, s.currentPrice,
        s.investedAmount, s.currentValue, s.profitLoss,
      ]),
      [],
      ["Summary"],
      ["Total Invested (USD)", portfolio.summary.totalInvested],
      ["Total Current Value (USD)", portfolio.summary.totalCurrentValue],
      ["Total P/L (USD)", portfolio.summary.totalProfitLoss],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Export PDF (print-to-PDF via browser) ──────────────────────────────
  const exportPDF = () => {
    const printContent = `
      <html><head><title>Portfolio Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 32px; color: #111; }
        h1 { font-size: 24px; margin-bottom: 4px; }
        p.sub { color: #666; font-size: 13px; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th { background: #f3f4f6; padding: 10px; text-align: left; font-size: 13px; }
        td { padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
        .green { color: #22c55e; } .red { color: #ef4444; }
        .summary { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .card { background: #f9fafb; border-radius: 8px; padding: 16px; }
        .card p { margin: 0; font-size: 12px; color: #666; }
        .card h3 { margin: 4px 0 0; font-size: 20px; }
      </style></head><body>
      <h1>Portfolio Report</h1>
      <p class="sub">Generated on ${new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}</p>
      <div class="summary">
        <div class="card"><p>Total Invested</p><h3>$${portfolio.summary.totalInvested}</h3></div>
        <div class="card"><p>Current Value</p><h3>$${portfolio.summary.totalCurrentValue}</h3></div>
        <div class="card"><p>Total P/L</p><h3 class="${portfolio.summary.totalProfitLoss >= 0 ? "green" : "red"}">$${portfolio.summary.totalProfitLoss}</h3></div>
      </div>
      <table>
        <thead><tr><th>Symbol</th><th>Qty</th><th>Buy Price</th><th>Current Price</th><th>P/L</th></tr></thead>
        <tbody>
          ${portfolio.stocks.map((s) => `
            <tr>
              <td><b>${s.symbol}</b></td>
              <td>${s.quantity}</td>
              <td>$${s.buyPrice}</td>
              <td>$${s.currentPrice}</td>
              <td class="${s.profitLoss >= 0 ? "green" : "red"}">$${s.profitLoss}</td>
            </tr>`).join("")}
        </tbody>
      </table>
      <p style="font-size:11px;color:#aaa">Values shown in USD. Generated by FinTrack.</p>
      </body></html>
    `;
    const w = window.open("", "_blank");
    w.document.write(printContent);
    w.document.close();
    w.print();
  };

  if (authLoading || loading || currencyLoading) {
    return (
      <AppLayout title="Portfolio">
        <div className="text-center mt-20 text-lg">Loading portfolio...</div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Portfolio">
        <div className="text-center mt-20 text-red-500">{error}</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Portfolio">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Portfolio</h1>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} title="Export CSV"
            className="p-2.5 rounded-xl border border-gray-200 dark:border-darkBorder
            text-gray-500 dark:text-gray-400
            hover:bg-gray-100 dark:hover:bg-darkBg transition">
            <FaFileCsv size={16} />
          </button>
          <button onClick={exportPDF} title="Download PDF Report"
            className="p-2.5 rounded-xl border border-gray-200 dark:border-darkBorder
            text-gray-500 dark:text-gray-400
            hover:bg-gray-100 dark:hover:bg-darkBg transition">
            <FaFilePdf size={16} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 rounded-xl bg-lightAccent dark:bg-darkAccent
            text-white dark:text-black font-medium hover:scale-105 transition"
          >
            + Add Investment
          </button>
        </div>
      </div>

      {portfolio?.stocks?.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400">No investments yet.</p>
      )}

      {/* Stock Cards — all values converted from USD via format() */}
      <div className="grid md:grid-cols-2 gap-6">
        {portfolio?.stocks?.map((stock) => (
          <div
            key={stock.symbol}
            className="p-6 rounded-2xl bg-white dark:bg-darkCard
            border border-gray-200 dark:border-darkBorder
            shadow-sm hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
              {stock.symbol}
            </h3>
            <div className="space-y-1 text-gray-700 dark:text-gray-300">
              <p>Quantity: {stock.quantity}</p>
              <div className="flex items-baseline gap-2">
                <p>Buy Price:</p>
                <span className="font-medium">
                  {stock.isCustom ? `${currencyMeta.symbol}${stock.buyPrice}` : format(stock.buyPrice)}
                </span>
                {!stock.isCustom && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    (${stock.buyPrice.toFixed(2)} USD)
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <p>Current Price:</p>
                <span className="font-medium">
                  {stock.isCustom ? `${currencyMeta.symbol}${stock.currentPrice}` : format(stock.currentPrice)}
                </span>
                {!stock.isCustom && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    (${stock.currentPrice.toFixed(2)} USD)
                  </span>
                )}
              </div>
            </div>
            <p className="mt-4 font-semibold">
              P/L:{" "}
              <span className={stock.profitLoss >= 0 ? "text-green-500" : "text-red-500"}>
                {stock.isCustom ? `${currencyMeta.symbol}${stock.profitLoss}` : format(stock.profitLoss)}
              </span>
            </p>
            {stock.isCustom && (
              <p className="text-purple-400 text-sm mt-2">Custom Asset</p>
            )}
            <div className="flex gap-6 mt-5 text-sm font-medium">
              <button onClick={() => setEditingStock(stock)} className="text-blue-500 hover:underline">Edit</button>
              <button onClick={() => handleDelete(stock.stockId)} className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-12 p-8 rounded-2xl bg-white dark:bg-darkCard
        border border-gray-200 dark:border-darkBorder shadow-sm">
        <h2 className="text-xl font-bold mb-5 text-gray-800 dark:text-white">Portfolio Summary</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Invested</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {format(portfolio?.summary?.totalInvested)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Current Value</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {format(portfolio?.summary?.totalCurrentValue)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Total P/L</p>
            <p className={`text-lg font-semibold ${
              portfolio?.summary?.totalProfitLoss >= 0 ? "text-green-500" : "text-red-500"
            }`}>
              {format(portfolio?.summary?.totalProfitLoss)}
            </p>
          </div>
        </div>
      </div>

      {editingStock && (
        <EditStockModal
          stock={{
            ...editingStock,
            // Show buy price in display currency so user edits in familiar units
            buyPrice: editingStock.isCustom
              ? editingStock.buyPrice
              : convert(editingStock.buyPrice),
          }}
          onClose={() => setEditingStock(null)}
          onSave={handleEditSave}
        />
      )}

      {showModal && (
        <AddInvestmentModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchPortfolio}
        />
      )}
    </AppLayout>
  );
};

export default Portfolio;