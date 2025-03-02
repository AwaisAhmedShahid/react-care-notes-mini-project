import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import apiRoutes from "./routes";

const app = express();

const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/v1", apiRoutes);

// health check
app.get("/", (_, res) => {
  res.send("Hello From Care Notes Mini!");
});

// 404
app.use("*", (_, res) => {
  res.status(404).send("Not Found");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
