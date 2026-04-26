import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let captured: unknown;
  const original = res.json.bind(res);
  res.json = (body: unknown) => {
    captured = body;
    return original(body);
  };
  res.on("finish", () => {
    if (!reqPath.startsWith("/api")) return;
    const dur = Date.now() - start;
    let line = `${req.method} ${reqPath} ${res.statusCode} in ${dur}ms`;
    if (captured) {
      try {
        const json = JSON.stringify(captured);
        if (json.length < 120) line += ` :: ${json}`;
      } catch {}
    }
    log(line);
  });
  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    log(`error ${status}: ${message}`);
  });

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT ?? "5000", 10);
  server.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
    log(`serving on port ${port}`);
  });
})();
