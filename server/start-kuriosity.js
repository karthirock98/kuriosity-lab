// Silence is Golden
import "dotenv/config";
import express from "express";
import auth_routers from "./src/routes/auth-routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import GENERIC_ROUTES from "./src/routes/generic-routes.js";
import GROQ_ROUTES from "./src/routes/groq-routes.js";
import COUNTRIES_ROUTES from "./src/routes/countries-routes.js";
import { createServer } from "node:http";
import { initializeSocket } from "./src/services/socket-service.js";
const app_init = express();

const socket_http_server = createServer(app_init);
initializeSocket(socket_http_server);

app_init.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin || true);
    },
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app_init.use(cookieParser())
app_init.use(express.json());
app_init.use(express.urlencoded({ extended: true }));

app_init.use("/auth", auth_routers);
app_init.use("/generic", GENERIC_ROUTES)
app_init.use("/groq", GROQ_ROUTES)
app_init.use("/rest-countires", COUNTRIES_ROUTES)
socket_http_server.listen(process.env.PORT, () => {
  console.log(`Listening the Server ${process.env.PORT}`, new Date());
});
