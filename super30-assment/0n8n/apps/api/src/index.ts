import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import workflowRoutes from "./routes/workflow.routes.js";
import credentialRoutes from "./routes/credential.routes.js";
import executionRoutes from "./routes/execution.routes.js";

const app = express();

app.use(express.json());

// Comma-separated list of allowed browser origins, e.g.
// CORS_ORIGINS="http://localhost:3000,https://autm8n.vercel.app"
const allowedOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:3000")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

app.use(cors({
        origin: allowedOrigins,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["Content-Type", "Cache-Control", "Expires"],
    })
);

app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/api/v1", authRoutes);
app.use("/workflow", workflowRoutes);
app.use("/api/v1/credentials", credentialRoutes);
app.use("/", executionRoutes);


// Railway (and most PaaS) inject the port to bind. Hardcoding one fails their healthcheck.
const PORT = Number(process.env.PORT) || 3002;

app.listen(PORT, "0.0.0.0", () =>{
    console.log(`Server running on port ${PORT}`);
    console.log(`CORS allowed origins: ${allowedOrigins.join(", ")}`);
});
