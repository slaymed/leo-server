import "reflect-metadata";
import { createConnection } from "typeorm";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// middleware
import trim from "./middleware/trim";

// Routes
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(trim);
app.use(cookieParser());
app.use(cors());

app.use(express.static("public"));

app.use("/api/auth", authRoutes);

app.get("/", async (_, res) => res.send("Hello world"));

app.listen(process.env.PORT || 5000, async () => {
    console.log("Server is running at http://localhost:5000");
    try {
        await createConnection();
        console.log("Database connected");
    } catch (err) {
        console.log(err);
    }
});
