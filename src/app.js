import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { rateLimit } from 'express-rate-limit';

import peoeRoutes from "./routes/peoe.routes.js";

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, //1 minuto
    max: 40 //Total de solicitudes por minuto
})

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.use(limiter);

app.use("/api", peoeRoutes);

export default app;
