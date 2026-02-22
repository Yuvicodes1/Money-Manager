import { useState } from "react";
import axios from "axios";
import { auth } from "../firebase";

const AddInvestmentModal = ({ onClose, onSuccess }) => {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [estSellPrice, setEstSellPrice] = useState("");

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;

      await axios.post("http://localhost:5000/api/portfolio/add-stock", {
        firebaseUID: user.uid,
        symbol,
        quantity: Number(quantity),
        buyPrice: Number(buyPrice),
        estSellPrice: isCustom ? Number(estSellPrice) : null,
        isCustom
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Add investment error:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white dark:bg-darkCard p-6 rounded-xl w-96">

        <h2 className="text-xl font-bold mb-4">Add Investment</h2>

        <input
          type="text"
          placeholder={isCustom ? "Asset Name" : "Stock Symbol"}
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="number"
          placeholder="Buy Price"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <div className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            checked={isCustom}
            onChange={() => setIsCustom(!isCustom)}
          />
          <label>Custom Asset</label>
        </div>

        {isCustom && (
          <input
            type="number"
            placeholder="Estimated Sell Price"
            value={estSellPrice}
            onChange={(e) => setEstSellPrice(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
          />
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-lightAccent dark:bg-darkAccent text-white dark:text-black"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddInvestmentModal;