import express from "express";
import cors from "cors";
import indexRoute from "./routes/index.route.js";

const app = express();

// cors
app.use(cors());

// use - middleware
// express.json() - middleware that parses incoming requests with JSON payloads
app.use(express.json());

// for every request, use the router
app.use(indexRoute);

// listen - start the server and listen to requests
// param1 port - the port number to listen to
// param2 callback function - what to do when the server starts
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
