const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ THIS MUST EXIST
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ✅ ROUTES
app.use("/auth", require("./routes/auth"));
app.use("/tasks", require("./routes/tasks"));

// ✅ DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ✅ PORT + HOST
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});