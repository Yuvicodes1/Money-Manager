import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function PortfolioChart({ stocks }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!stocks || stocks.length === 0) return;

    const fetchHistory = async () => {
      try {
        let portfolioMap = {};

        for (const stock of stocks) {
          const res = await fetch(
            `http://localhost:5000/api/market/history?symbol=${stock.symbol}`
          );

          const json = await res.json();
          const history = json.data;

          history.forEach((day) => {
            const date = day.date;
            const value = day.close * stock.quantity;

            if (!portfolioMap[date]) {
              portfolioMap[date] = {
                date,
                value: 0,
              };
            }

            portfolioMap[date].value += value;
          });
        }

        const mergedData = Object.values(portfolioMap).sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        setChartData(mergedData);

      } catch (error) {
        console.error("History fetch error:", error);
      }
    };

    fetchHistory();
  }, [stocks]);

  return (
    <div
      className="p-6 rounded-2xl shadow-md
      bg-white dark:bg-darkCard
      border border-gray-200 dark:border-darkBorder
      mt-10"
    >
      <h2 className="text-lg font-semibold mb-6">
        Portfolio Performance
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="value"
            name="Portfolio Value"
            stroke="#2DD4BF"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}