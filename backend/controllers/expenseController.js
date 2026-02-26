const axios = require("axios");
const { Expense, Salary, CATEGORIES } = require("../models/Expense");
const User = require("../models/User");

const getUser = async (firebaseUID) => {
  const user = await User.findOne({ firebaseUID });
  if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404 });
  return user;
};

const parseMonth = (month) => {
  if (month) return month;
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

// ==============================
// GET /expenses/:firebaseUID
// ==============================
exports.getExpenses = async (req, res) => {
  try {
    const { firebaseUID } = req.params;
    const { month } = req.query;
    const user = await getUser(firebaseUID);

    let query = { user: user._id };
    if (month) {
      const [year, mon] = month.split("-").map(Number);
      query.date = { $gte: new Date(year, mon - 1, 1), $lt: new Date(year, mon, 1) };
    }

    const expenses = await Expense.find(query).sort({ date: -1 });

    const categoryTotals = CATEGORIES.reduce((acc, cat) => { acc[cat] = 0; return acc; }, {});
    expenses.forEach((e) => {
      categoryTotals[e.category] = parseFloat(((categoryTotals[e.category] || 0) + e.amount).toFixed(2));
    });

    const totalSpent = parseFloat(expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2));
    const targetMonth = parseMonth(month);
    const salaryDoc = await Salary.findOne({ user: user._id, month: targetMonth });

    res.status(200).json({
      expenses,
      summary: {
        totalSpent,
        categoryTotals,
        month: targetMonth,
        salary: salaryDoc?.amount ?? null,
        remaining: salaryDoc ? parseFloat((salaryDoc.amount - totalSpent).toFixed(2)) : null,
      },
    });
  } catch (error) {
    console.error("Get Expenses Error:", error);
    res.status(error.statusCode || 500).json({ message: error.message || "Server error" });
  }
};

// ==============================
// POST /expenses
// ==============================
exports.addExpense = async (req, res) => {
  try {
    const { firebaseUID, amount, category, note, date } = req.body;
    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ message: "Invalid category." });
    }
    const user = await getUser(firebaseUID);
    const expense = await Expense.create({
      user: user._id, amount, category,
      note: note || "",
      date: date ? new Date(date) : new Date(),
    });
    res.status(201).json(expense);
  } catch (error) {
    console.error("Add Expense Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// PUT /expenses/:expenseId
// ==============================
exports.updateExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { amount, category, note, date } = req.body;
    const expense = await Expense.findByIdAndUpdate(
      expenseId,
      { amount, category, note, date: date ? new Date(date) : undefined },
      { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.status(200).json(expense);
  } catch (error) {
    console.error("Update Expense Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// DELETE /expenses/:expenseId
// ==============================
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.expenseId);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete Expense Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// POST /expenses/salary
// ==============================
exports.setSalary = async (req, res) => {
  try {
    const { firebaseUID, amount, month } = req.body;
    const user = await getUser(firebaseUID);
    const targetMonth = parseMonth(month);
    const salary = await Salary.findOneAndUpdate(
      { user: user._id, month: targetMonth },
      { amount },
      { upsert: true, new: true }
    );
    res.status(200).json(salary);
  } catch (error) {
    console.error("Set Salary Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// GET /expenses/categories  ← THIS WAS MISSING — caused the crash
// ==============================
exports.getCategories = async (req, res) => {
  res.status(200).json({ categories: CATEGORIES });
};

// ==============================
// POST /expenses/ai-chat  (Hugging Face Inference API)
// ==============================
exports.aiChat = async (req, res) => {
  try {
    if (!process.env.HUGGINGFACE_API_KEY) {
      return res.status(500).json({
        message: "HUGGINGFACE_API_KEY is not set in your backend .env file. Add it and restart.",
      });
    }

    const { firebaseUID, message, history, month } = req.body;
    const user = await getUser(firebaseUID);
    const targetMonth = parseMonth(month);
    const [year, mon] = targetMonth.split("-").map(Number);

    const expenses = await Expense.find({
      user: user._id,
      date: { $gte: new Date(year, mon - 1, 1), $lt: new Date(year, mon, 1) },
    }).sort({ date: -1 });

    const salaryDoc = await Salary.findOne({ user: user._id, month: targetMonth });
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    const categoryTotals = {};
    expenses.forEach((e) => {
      categoryTotals[e.category] = parseFloat(
        ((categoryTotals[e.category] || 0) + e.amount).toFixed(2)
      );
    });

    const systemPrompt = `You are a helpful personal finance assistant analyzing a user's expenses for ${targetMonth}.

Financial data:
- Monthly Salary: ${salaryDoc ? `₹${salaryDoc.amount}` : "Not set"}
- Total Spent: ₹${totalSpent.toFixed(2)}
- Remaining: ${salaryDoc ? `₹${(salaryDoc.amount - totalSpent).toFixed(2)}` : "Unknown"}

Spending by category:
${Object.entries(categoryTotals).map(([cat, amt]) => `- ${cat}: ₹${amt}`).join("\n")}

Recent expenses:
${expenses.slice(0, 20).map((e) =>
  `- ${new Date(e.date).toLocaleDateString("en-IN")}: ₹${e.amount} on ${e.category}${e.note ? ` (${e.note})` : ""}`
).join("\n")}

Be concise, friendly, and give specific actionable advice. Use ₹ for currency.`;

    // Build conversation: inject system context into first user message
    // HF Inference API supports the OpenAI-compatible chat/completions endpoint
    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []),
      { role: "user", content: message },
    ];

    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: "meta-llama/Llama-3.1-8B-Instruct:cerebras",
        messages,
        max_tokens: 1024,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      reply: response.data.choices[0].message.content,
    });

  } catch (error) {
    console.error("AI Chat Error:", error.response?.data || error.message);
    res.status(500).json({ message: "AI service error. Please try again." });
  }
};