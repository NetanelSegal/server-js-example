import express from "express";

const app = express();

// get - handle GET requests
// param1 - the route
// param2 - the callback to execute when the route is accessed
// the callback function:
// param1 - the request object
// param2 - the response object
app.get("/", (req, res) => {
  res.json({
    message: "Hello World!",
  });
});

// listen - start the server and listen to requests
// param1 port - the port number to listen to
// param2 callback function - what to do when the server starts
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
