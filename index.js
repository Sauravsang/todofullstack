import express from "express";
import dotenv from "dotenv";
import dbConect from "./db/dbConect.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Load environment variables from .env file

dotenv.config();

// Middleware

app.use(express.json());

const corsOption = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOption));

app.use(cookieParser());

// Connect to MongoDB
dbConect();

// Routes

app.use("/api/users", userRoutes);
app.use("/api/todo", todoRoutes);
// listen
app.use(express.static(path.join(__dirname,"/Frontend/dist")));

app.use("*",(_,res)=>{
  res.sendFile(path.join(__dirname,"/Frontend/dist/index.html"));
 });


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
