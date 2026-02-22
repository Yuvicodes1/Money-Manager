import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import API from "../services/API";
import { useNavigate } from "react-router-dom";

export default function Market() {

  const [stocks, setStocks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStocks = async () => {
      const res = await API.get("/market/top");
      setStocks(res.data.data);
    };

    fetchStocks();
  }, []);

  return (
    <AppLayout title="Market">

      <div className="grid md:grid-cols-3 gap-6">

        {stocks.map((stock) => (
          <div
            key={stock.symbol}
            className="p-6 rounded-2xl shadow-md
            bg-white dark:bg-darkCard
            border border-gray-200 dark:border-darkBorder
            cursor-pointer hover:shadow-xl transition"
            onClick={() => navigate(`/stock/${stock.symbol}`)}
          >
            <h2 className="text-xl font-semibold">
              {stock.symbol}
            </h2>

            <p className="text-lg mt-2">
              ₹{stock.currentPrice}
            </p>

            <p className={`mt-1 ${
              stock.change >= 0 ? "text-green-500" : "text-red-500"
            }`}>
              {stock.percentChange}%
            </p>
          </div>
        ))}

      </div>

    </AppLayout>
  );
}