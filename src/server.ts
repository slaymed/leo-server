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
import boardbandRoutes from "./routes/boardband";
import dateRoutes from "./routes/date";
import gocardlessRoutes from "./routes/gocardless";

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(trim);
app.use(cookieParser());
app.use(express.static("public"));
app.use(
    cors({
        credentials: true,
        origin: process.env.ORIGIN,
        optionsSuccessStatus: 200,
    })
);

app.use("/api/auth", authRoutes);
app.use("/api", boardbandRoutes);
app.use("/api", dateRoutes);
app.use("/api/auth", gocardlessRoutes);

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
