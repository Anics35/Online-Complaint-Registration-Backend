const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Route imports
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const complaintRouter = require("./routes/complaintRoutes");
const actionRouter = require("./routes/actionRoutes");

// Routes
app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/complaint", complaintRouter);
app.use("/action", actionRouter);

// Connect to DB and start server
connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3018, () => {
      console.log("Server is successfully listening on port 3018...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!", err.message);
  });
