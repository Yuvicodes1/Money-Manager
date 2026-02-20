import { useEffect, useState } from "react";
import AppLayout from "../components/layout/Applayout";
import API from "../services/api";

export default function Dashboard() {

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = "6990d35cc2fae37338b34a23";

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await API.get(`/portfolio/${userId}`);
        setPortfolio(res.data);
      } catch (err) {
        setError("Failed to load portfolio.");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const formatCurrency = (num) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(num || 0);

  if (loading) {
    return (
      <AppLayout title="Dashboard">
        <div className="text-center mt-20 text-lg">
          Loading portfolio...
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Dashboard">
        <div className="text-center mt-20 text-red-500">
          {error}
        </div>
      </AppLayout>
    );
  }

  const summary = portfolio.summary;

  return (
    <AppLayout title="Dashboard">

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <SummaryCard
          title="Total Invested"
          value={formatCurrency(summary.totalInvested)}
        />

        <SummaryCard
          title="Current Value"
          value={formatCurrency(summary.totalCurrentValue)}
        />

        <SummaryCard
          title="Profit / Loss"
          value={formatCurrency(summary.totalProfitLoss)}
          highlight
          positive={summary.totalProfitLoss >= 0}
        />

      </div>

      {/* Stock Table */}
      <div className="rounded-2xl overflow-hidden
        bg-white dark:bg-darkCard
        border border-gray-200 dark:border-darkBorder
        shadow-md"
      >
        <table className="w-full text-left">

          <thead className="bg-gray-100 dark:bg-darkBg">
            <tr>
              <th className="p-4">Symbol</th>
              <th className="p-4">Qty</th>
              <th className="p-4">Buy Price</th>
              <th className="p-4">Current Price</th>
              <th className="p-4">P/L</th>
            </tr>
          </thead>

          <tbody>
            {portfolio.stocks.map((stock, index) => (
              <tr
                key={index}
                className="border-t border-gray-200 dark:border-darkBorder"
              >
                <td className="p-4 font-semibold">{stock.symbol}</td>
                <td className="p-4">{stock.quantity}</td>
                <td className="p-4">{formatCurrency(stock.buyPrice)}</td>
                <td className="p-4">{formatCurrency(stock.currentPrice)}</td>
                <td
                  className={`p-4 font-semibold ${
                    stock.profitLoss >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {formatCurrency(stock.profitLoss)}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </AppLayout>
  );
}


/* ---------------- Summary Card Component ---------------- */

function SummaryCard({ title, value, highlight, positive }) {
  return (
    <div className="p-6 rounded-2xl shadow-md
      bg-white dark:bg-darkCard
      border border-gray-200 dark:border-darkBorder"
    >
      <h3 className="text-sm text-lightMuted dark:text-gray-400">
        {title}
      </h3>

      <p
        className={`text-2xl font-bold mt-2 ${
          highlight
            ? positive
              ? "text-green-500"
              : "text-red-500"
            : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}