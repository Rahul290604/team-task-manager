const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

mongoose.connect("mongodb://rahul290604_db_user:Rahul123@ac-s8mjls5-shard-00-00.b0kp2k2.mongodb.net:27017,ac-s8mjls5-shard-00-01.b0kp2k2.mongodb.net:27017,ac-s8mjls5-shard-00-02.b0kp2k2.mongodb.net:27017/?ssl=true&replicaSet=atlas-hidecw-shard-0&authSource=admin&appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));
app.use("/auth", require("./routes/auth"));
app.use("/projects", require("./routes/projects"));
app.use("/tasks", require("./routes/tasks"));
const User = require("./models/User");

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});