import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import API from "../services/Api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function StockDetails() {
  const { symbol } = useParams();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [range, setRange] = useState("1M");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [buyPrice, setBuyPrice] = useState("");

  // TEMP: Replace after Firebase integration
  const userId = localStorage.getItem("userId");

  // ===============================
  // Fetch Historical Data
  // ===============================
  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get(
        `/market/history?symbol=${symbol}&range=${range}`
      );

      setHistory(res.data.data);
    } catch (err) {
      console.error("History fetch error:", err);
      setError("Failed to load stock history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();

    const interval = setInterval(() => {
      fetchHistory();
    }, 30 * 60 * 1000); // refresh every 30 min

    return () => clearInterval(interval);
  }, [symbol, range]);

  // ===============================
  // Add to Portfolio
  // ===============================
  const handleAddToPortfolio = async () => {
    if (!userId) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    if (!quantity || quantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (!buyPrice || buyPrice <= 0) {
      alert("Please enter a valid buy price.");
      return;
    }

    try {
      await API.post("/portfolio/add-stock", {
        userId,
        symbol,
        quantity: Number(quantity),
        buyPrice: Number(buyPrice),
      });

      // Reset modal
      setQuantity(1);
      setBuyPrice("");
      setShowModal(false);

      navigate("/dashboard");
    } catch (error) {
      console.error("Add stock error:", error);
      alert("Failed to add stock.");
    }
  };

  return (
    <AppLayout title={symbol}>
      <div
        className="p-6 rounded-2xl shadow-md
        bg-white dark:bg-darkCard
        border border-gray-200 dark:border-darkBorder"
      >
        <h2 className="text-xl font-semibold mb-6">
          {symbol} Performance
        </h2>

        {/* Range Selector */}
        <div className="flex gap-4 mb-6">
          {["1M", "6M", "1Y"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-2 rounded-lg transition ${
                range === r
                  ? "bg-lightAccent text-white dark:bg-darkAccent dark:text-black"
                  : "bg-gray-200 dark:bg-darkBorder"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Chart Section */}
        {loading ? (
          <p className="text-center py-10">Loading chart...</p>
        ) : error ? (
          <p className="text-red-500 text-center py-10">{error}</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="close"
                stroke="#2DD4BF"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {/* Add Button */}
        <button
          onClick={() => setShowModal(true)}
          className="mt-8 px-6 py-3 rounded-xl
          bg-lightAccent text-white
          dark:bg-darkAccent dark:text-black
          hover:scale-105 transition"
        >
          Add to Portfolio
        </button>
      </div>

      {/* ===============================
            Add Stock Modal
      =============================== */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white dark:bg-darkCard p-8 rounded-2xl w-96">
            <h3 className="text-lg font-semibold mb-4">
              Add {symbol}
            </h3>

            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4
              bg-white dark:bg-darkBg
              border-gray-300 dark:border-darkBorder"
            />

            <input
              type="number"
              placeholder="Buy Price"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              className="w-full p-3 border rounded-lg mb-6
              bg-white dark:bg-darkBg
              border-gray-300 dark:border-darkBorder"
            />

            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleAddToPortfolio}
                disabled={!quantity || !buyPrice}
                className={`px-4 py-2 rounded-lg text-white transition ${
                  !quantity || !buyPrice
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:scale-105"
                }`}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}