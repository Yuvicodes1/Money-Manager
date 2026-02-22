import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../firebase";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPortfolio = async () => {
    try {
      const user = auth.currentUser;

      const res = await axios.get(
        `http://localhost:5000/api/portfolio/${user.uid}`
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Portfolio</h1>

      {portfolio?.stocks?.length === 0 && (
        <p>No investments yet.</p>
      )}

      {portfolio?.stocks?.map((stock, index) => (
        <div key={index} className="p-4 border rounded mb-2">
          <h3 className="font-semibold">{stock.symbol}</h3>
          <p>Quantity: {stock.quantity}</p>
          <p>Buy Price: ₹{stock.buyPrice}</p>
          <p>Current Price: ₹{stock.currentPrice}</p>
          <p>
            P/L:{" "}
            <span
              className={
                stock.profitLoss >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              ₹{stock.profitLoss}
            </span>
          </p>

          {stock.isCustom && (
            <p className="text-purple-500 text-sm">Custom Asset</p>
          )}
        </div>
      ))}

      <div className="mt-6 p-4 border rounded">
        <h2 className="font-bold">Summary</h2>
        <p>Total Invested: ₹{portfolio?.summary?.totalInvested}</p>
        <p>Total Value: ₹{portfolio?.summary?.totalCurrentValue}</p>
        <p>
          Total P/L:{" "}
          <span
            className={
              portfolio?.summary?.totalProfitLoss >= 0
                ? "text-green-600"
                : "text-red-600"
            }
          >
            ₹{portfolio?.summary?.totalProfitLoss}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Portfolio;