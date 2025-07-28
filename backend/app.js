import cors from "cors";
import express from "express";
import router from "./routes/index.js";
import { errorHandler } from "./utils/errorHandler.js";
import { corsOptions } from "./utils/corsConfiguration.js";
import { limiter } from "./utils/rateLimiter.js";
import { HttpStatus, responseMessage } from "./utils/constants.js";
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(limiter);
app.use("/api/v1", router);

app.get("/", (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res
      .status(HttpStatus.OK)
      .json({ message: "Api endpoint is working fine." });
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: responseMessage.SERVER_ERROR });
  }
});

app.use(errorHandler);
//middleware for undefined routes
app.use((req, res, next) => {
  res.status(HttpStatus.NOT_FOUND).json({
    error: "Not Found",
    message: `The route ${req.originalUrl} does not exist on this server.`,
  });
});

export { app };
