import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../firebase";
import AddInvestmentModal from "../components/AddInvestmentModal";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchPortfolio = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const res = await axios.get(
        `http://localhost:5000/api/portfolio/${user.uid}`,
      );

      setPortfolio(res.data);
    } catch (error) {
      console.error("Portfolio load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleDelete = async (symbol) => {
    try {
      const user = auth.currentUser;
      await axios.delete("http://localhost:5000/api/portfolio/remove-stock", {
        data: {
          firebaseUID: user.uid,
          symbol,
        },
      });
      fetchPortfolio();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleEdit = async (stock) => {
    const newQty = prompt("Enter new quantity", stock.quantity);
    if (!newQty) return;

    try {
      const user = auth.currentUser;
      await axios.put("http://localhost:5000/api/portfolio/update-stock", {
        firebaseUID: user.uid,
        symbol: stock.symbol,
        quantity: Number(newQty),
      });
      fetchPortfolio();
    } catch (error) {
      console.error("Edit error:", error);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-lightBg dark:bg-darkBg transition-colors duration-300 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          My Portfolio
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl
        bg-lightAccent dark:bg-darkAccent
        text-white dark:text-black
        font-medium
        hover:scale-105 transition"
        >
          + Add Investment
        </button>
      </div>

      {/* Empty State */}
      {portfolio?.stocks?.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400">No investments yet.</p>
      )}

      {/* Stock Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {portfolio?.stocks?.map((stock, index) => (
          <div
            key={index}
            className="
          p-6 rounded-2xl
          bg-white dark:bg-darkCard
          border border-gray-200 dark:border-darkBorder
          shadow-sm dark:shadow-none
          transition hover:shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
              {stock.symbol}
            </h3>

            <div className="space-y-1 text-gray-700 dark:text-gray-300">
              <p>Quantity: {stock.quantity}</p>
              <p>Buy Price: ₹{stock.buyPrice}</p>
              <p>Current Price: ₹{stock.currentPrice}</p>
            </div>

            <p className="mt-4 font-semibold">
              P/L:{" "}
              <span
                className={
                  stock.profitLoss >= 0 ? "text-green-500" : "text-red-500"
                }
              >
                ₹{stock.profitLoss}
              </span>
            </p>

            {stock.isCustom && (
              <p className="text-purple-400 text-sm mt-2">Custom Asset</p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-6 mt-5 text-sm font-medium">
              <button
                onClick={() => handleEdit(stock)}
                className="text-blue-500 hover:underline"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(stock.symbol)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div
        className="
      mt-12 p-8 rounded-2xl
      bg-white dark:bg-darkCard
      border border-gray-200 dark:border-darkBorder
      shadow-sm dark:shadow-none"
      >
        <h2 className="text-xl font-bold mb-5 text-gray-800 dark:text-white">
          Portfolio Summary
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Total Invested
            </p>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              ₹{portfolio?.summary?.totalInvested}
            </p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Current Value
            </p>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              ₹{portfolio?.summary?.totalCurrentValue}
            </p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Total P/L
            </p>
            <p
              className={`text-lg font-semibold ${
                portfolio?.summary?.totalProfitLoss >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              ₹{portfolio?.summary?.totalProfitLoss}
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <AddInvestmentModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchPortfolio}
        />
      )}
    </div>
  );
};

export default Portfolio;
