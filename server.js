import express from "express";
import cors from "cors";
import indexRoute from "./routes/index.route.js";
import "./db/dbConnection.js";
import Logger from "./utils/Logger.js";
import { PORT } from "./env.config.js";

const app = express();

// use - middleware

// cors
app.use(cors());

// express.json() - middleware that parses incoming requests with JSON payloads
app.use(express.json());

// for every request, use the router
app.use(indexRoute);

// listen - start the server and listen to requests
// param1 port - the port number to listen to
// param2 callback function - what to do when the server starts

app.listen(PORT, () => {
  Logger.info(`Server is running on port http://localhost:${PORT}`);
});
